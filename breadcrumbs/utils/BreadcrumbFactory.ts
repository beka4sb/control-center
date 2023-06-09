import { t } from 'i18next';
import { UrlHelper } from '../../common/utils/UrlHelper';
import { BreadcrumbLocalizationKey, PATHS, Route } from '../../routing/routes';
import { Breadcrumb } from '../models/Breadcrumb';

export interface BreadcrumbsContext {
  nestedTabs?: Route[];
}

export interface ProjectBreadcrumbsContext extends BreadcrumbsContext {
  projectLabel: string | null;
}

export interface SlotBreadcrumbsContext extends ProjectBreadcrumbsContext {
  slotLabel: string | null;
}

export interface ReportBreadcrumbsContext extends SlotBreadcrumbsContext {
  reportLabel: string | null;
}

/**
 * BreadcrumbFactory contains all getters and helpers for generating breadcrumbs.
 * Allows us to reuse the configurations from other pages where it is logical
 */
export class BreadcrumbFactory {
  protected readonly urlHelper: UrlHelper;

  constructor() {
    this.urlHelper = UrlHelper.getInstance();
  }

  /**
   * getCurrentPath takes the tabs for a view and returns whichever tab matches
   * so we can append it to the end of the breadcrumbs array.
   * @param {Route[]} nestedTabs - Nested tabs defined for a view that has sub navigation.
   * @returns {Breadcrumb[]}
   */
  getCurrentPath(nestedTabs?: Route[]): Breadcrumb[] {
    const currentPath = nestedTabs?.find((route) => {
      const hasMatchingChildren = route?.nestedPaths?.find((childPath: string) => this.urlHelper.isCurrentPath({ path: childPath }));

      return this.urlHelper.isCurrentPath(route) || hasMatchingChildren;
    });

    if (currentPath) {
      return [currentPath] as Breadcrumb[];
    }

    return [];
  }

  getOrganizationBreadcrumbs(): Breadcrumb[] {
    return [
      { name: t(BreadcrumbLocalizationKey.HOME), path: PATHS.HOME_PAGE },
      { name: t(BreadcrumbLocalizationKey.OVERVIEW), path: PATHS.ORGANIZATION_DASHBOARD },
    ];
  }

  /**
   * Getter for retrieving ProjectController breadcrumbs
   * @param {ProjectBreadcrumbsContext} context
   * @returns {Breadcrumb[]}
   */
  getProjectControllerBreadcrumbs(context: ProjectBreadcrumbsContext): Breadcrumb[] {
    const { projectLabel, nestedTabs } = context;

    const breadcrumbs: Breadcrumb[] = [
      { name: t(BreadcrumbLocalizationKey.HOME), path: PATHS.HOME_PAGE },
      { name: t(BreadcrumbLocalizationKey.PROJECTS), path: PATHS.ORGANIZATION_PROJECTS },
      { name: projectLabel, path: PATHS.PROJECT_DASHBOARD },
      ...this.getCurrentPath(nestedTabs),
    ];

    return breadcrumbs;
  }

  /**
   * Getter for retrieving SlotController breadcrumbs
   * @param {SlotBreadcrumbsContext} context
   * @returns {Breadcrumb[]}
   */
  getSlotControllerBreadcrumbs(context: SlotBreadcrumbsContext): Breadcrumb[] {
    const { projectLabel, slotLabel, nestedTabs } = context;

    const breadcrumbs = [
      ...this.getProjectControllerBreadcrumbs({ projectLabel }),
      { name: t(BreadcrumbLocalizationKey.SLOTS), path: PATHS.PROJECT_SLOTS },
      { name: slotLabel || t(BreadcrumbLocalizationKey.SLOT), path: PATHS.SLOT_REPORTS },
      ...this.getCurrentPath(nestedTabs),
    ];

    return breadcrumbs;
  }

  /**
   * Getter for retrieving ReportController breadcrumbs
   * @param {ReportBreadcrumbsContext} context
   * @returns {Breadcrumb[]}
   */
  getReportControllerBreadcrumbs(context: ReportBreadcrumbsContext): Breadcrumb[] {
    const { reportLabel, nestedTabs, ...rest } = context;

    const breadcrumbs = [
      ...this.getSlotControllerBreadcrumbs(rest),
      { name: t(BreadcrumbLocalizationKey.REPORTS), path: PATHS.SLOT_REPORTS },
      { name: reportLabel || t(BreadcrumbLocalizationKey.REPORT), path: PATHS.REPORT_INVENTORY },
      ...this.getCurrentPath(nestedTabs),
    ];

    return breadcrumbs;
  }
}
