import { Data, Params } from '@angular/router';
import { RouterReducerState } from '@ngrx/router-store';
import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { RouterStateUrl } from './router.state';


const getRouterStateUrl = (routerState: RouterReducerState<RouterStateUrl>): RouterStateUrl | undefined => {
  return routerState?.state;
};

export const selectRouterState = createFeatureSelector<RouterReducerState<RouterStateUrl>>('router');

export const selectQueryParam: MemoizedSelector<object, Params | undefined> = createSelector(
  selectRouterState,
  (routerState: RouterReducerState<RouterStateUrl>): Params | undefined => {
    const state = getRouterStateUrl(routerState);
    return state?.queryParams;
  }
);

export const selectRouteParam: MemoizedSelector<object, Params | undefined> = createSelector(
  selectRouterState,
  (routerState: RouterReducerState<RouterStateUrl>): Params | undefined => {
    const state = getRouterStateUrl(routerState);
    return state?.params;
  }
);

export const selectRouteData: MemoizedSelector<object, Data | undefined> = createSelector(
  selectRouterState,
  (routerState: RouterReducerState<RouterStateUrl>): Data | undefined => {
    const state = getRouterStateUrl(routerState);
    return state?.data;
  }
);

export const selectRouteUrl: MemoizedSelector<object, string | undefined> = createSelector(
  selectRouterState,
  (routerState: RouterReducerState<RouterStateUrl>): string | undefined => {
    const state = getRouterStateUrl(routerState);
    return state?.url;
  }
);
