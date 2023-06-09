import { withLaunchDarkly } from './common/higher-order-components/with-launchdarkly';
import { withSharedProviders } from './common/higher-order-components/with-shared-providers';
import { setupNumberExtensions } from './common/types/number-extensions';
import { Router } from './routing/Router';

export const App = withLaunchDarkly(
  withSharedProviders(() => {
    setupNumberExtensions();

    return <Router />;
  })
);
