import * as Sentry from "@sentry/nextjs";

import { axiosPrivate } from "@/lib/axios/axiosPrivate";
import { API_ROUTES } from "@/v2/routes";

export const getMarkets = async (cookie) => {
  try {
      const { data } = await axiosPrivate.get(API_ROUTES.otc.getMarkets, {
          headers: {
              Cookie: cookie,
          },
      });

      return data;
  } catch (e) {
      if (e?.status && e.status !== 401) {
          Sentry.captureException({ location: "getMarkets", e });
      }
  }

  return [];
};

export const getOffers = async ({ otcId, filters = [], sort }) => {
    if (!otcId) return [];
    
    const { sortId = "", sortOrder = "" } = sort || {};
    const queryParams = new URLSearchParams({ filters, sortId, sortOrder });

    try {
        const { data } = await axiosPrivate.get(`${API_ROUTES.otc.getOffers}/${otcId}?${queryParams.toString()}`);

        console.log('data', data)

        return data;
    } catch (e) {
        console.log('offers-err', e)
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "getOffers", e });
        }
    }
    
    return [];
};

export const getOffersHistory = async ({ offerId, sort }) => {
    if (!offerId) return {};

    const { sortId = "", sortOrder = "" } = sort || {};
    const queryParams = new URLSearchParams({ sortId, sortOrder });

    try {
        const { data } = await axiosPrivate.get(`${API_ROUTES.otc.getHistory}/${offerId}?${queryParams.toString()}`);

        return data;
    } catch (e) {
        console.log('fetchHistory-err', e)
        if (e?.status && e.status !== 401) {
            Sentry.captureException({ location: "fetchHistory", e });
        }
    }
    
    return {}
};
