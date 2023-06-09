import React from 'react';
import { initLaunchDarklyClient } from '../../config/launch-darkly/FeatureFlagsController';
import { LaunchDarklyConfigService } from '../../config/launch-darkly/LaunchDarklyConfigService';
import { PATHS } from '../../routing/routes';

type WithLaunchDarklyProps = {
  children?: React.ReactNode;
  onLoaded?: () => void;
};

type WithLaunchDarklyState = {
  launchDarklyInitialized: boolean;
};

/**
 * Indicates how many attempts to fetch LaunchDarkly flags we allow
 * before we give up and display a blank page.
 * Necessary to handle stale cached context data, which causes the flags retrieval.
 * With a value of N, it allows the first attempts with locally cached context,
 * and in case of failure N - 1 attempts with a newly fetched context from the backend.
 */
const MAX_ATTEMPTS = 2;

export const withLaunchDarkly = (Component: any) => {
  return class extends React.Component<WithLaunchDarklyProps, WithLaunchDarklyState> {
    private readonly launchDarklyService: LaunchDarklyConfigService;
    private retryCount = 0;

    constructor(props: WithLaunchDarklyProps) {
      super(props);

      this.launchDarklyService = LaunchDarklyConfigService.getInstance();
      this.state = { launchDarklyInitialized: false };
    }

    componentDidMount() {
      this.initClient();
    }

    async initClient() {
      try {
        // If the page is the logout page, delegate all actions to the LogoutController.
        // This is only possible if LD (LaunchDarkly) has been initialized.
        // In the process of logging out, clean up any data held in the LD context.
        const isLogoutPage = (window.location.href || '').includes('logout');

        if (this.retryCount < MAX_ATTEMPTS && !isLogoutPage) {
          // Try to initialize the LaunchDarkly client and read the flags remotely
          await initLaunchDarklyClient();
        } else {
          // Maximum attempts reached or logout page, use default values for flags.
          // This can happen for network errors or in case of a on-prem
          // deployment with no access to LaunchDarkly
          console.warn(`Failed to retrieve feature configuration after ${this.retryCount} attempts. Using default values.`);
        }
        // LaunchDarkly is either initialized with remote or default values,
        // proceed with the display of children components
        this.setState({ launchDarklyInitialized: true });
        this.props.onLoaded?.();
      } catch (e) {
        console.warn(`Failed to retrieve feature configuration, retrying...`);
        this.retryCount++;
        await this.launchDarklyService.clearContext();
        await this.launchDarklyService.getContext();
        await this.initClient();
      }
    }

    render() {
      if (!this.state.launchDarklyInitialized) {
        return <></>;
      }
      const { onLoaded, ...rest } = this.props;
      return <Component {...rest} />;
    }
  };
};
