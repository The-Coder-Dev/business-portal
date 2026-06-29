import { relations } from "drizzle-orm";

import { users, userProfiles, staffAssignments } from "./users";
import { countries, states, cities, pincodes } from "./locations";
import {
  categories,
  subcategories,
  businessTypeCategoryMap,
} from "./categories";
import {
  businesses,
  businessMeta,
  attributeDefinitions,
  serviceAreas,
  tags,
  businessTags,
} from "./businesses";
import {
  businessHours,
  businessGallery,
  businessVideos,
  businessSocialLinks,
} from "./business-media";
import {
  businessVerifications,
  verificationDocuments,
  verificationStatusHistory,
} from "./verifications";
import { reviews, reviewImages, reviewReplies, reviewHelpfulVotes } from "./reviews";
import { leads, leadStatusHistory, leadNotes } from "./leads";
import { packages, subscriptions, payments } from "./subscriptions";
import {
  advertisements,
  bannerAds,
  adImpressionsLog,
} from "./advertisements";
import {
  notifications,
  auditLogs,
  favorites,
  searchHistory,
  recentlyViewed,
} from "./platform";

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles, {
    fields: [users.id],
    references: [userProfiles.userId],
  }),
  businesses: many(businesses),
  reviews: many(reviews),
  reviewReplies: many(reviewReplies),
  reviewHelpfulVotes: many(reviewHelpfulVotes),
  leads: many(leads),
  assignedLeads: many(leads, { relationName: "assignedLeads" }),
  leadNotes: many(leadNotes),
  notifications: many(notifications),
  favorites: many(favorites),
  searchHistory: many(searchHistory),
  recentlyViewed: many(recentlyViewed),
  auditLogs: many(auditLogs),
  staffAssignments: many(staffAssignments),
  approvedReviews: many(reviews, { relationName: "approvedReviews" }),
  verifiedBusinesses: many(businessVerifications, {
    relationName: "verifiedBusinesses",
  }),
  payments: many(payments),
  advertisements: many(advertisements),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

export const staffAssignmentsRelations = relations(
  staffAssignments,
  ({ one }) => ({
    staff: one(users, {
      fields: [staffAssignments.staffId],
      references: [users.id],
    }),
    city: one(cities, {
      fields: [staffAssignments.cityId],
      references: [cities.id],
    }),
    category: one(categories, {
      fields: [staffAssignments.categoryId],
      references: [categories.id],
    }),
  })
);

// ─── Locations ────────────────────────────────────────────────────────────────

export const countriesRelations = relations(countries, ({ many }) => ({
  states: many(states),
}));

export const statesRelations = relations(states, ({ one, many }) => ({
  country: one(countries, {
    fields: [states.countryId],
    references: [countries.id],
  }),
  cities: many(cities),
  businesses: many(businesses),
}));

export const citiesRelations = relations(cities, ({ one, many }) => ({
  state: one(states, { fields: [cities.stateId], references: [states.id] }),
  pincodes: many(pincodes),
  businesses: many(businesses),
  serviceAreas: many(serviceAreas),
  staffAssignments: many(staffAssignments),
  advertisements: many(advertisements, { relationName: "targetCity" }),
}));

export const pincodesRelations = relations(pincodes, ({ one }) => ({
  city: one(cities, { fields: [pincodes.cityId], references: [cities.id] }),
}));

// ─── Categories ───────────────────────────────────────────────────────────────

export const categoriesRelations = relations(categories, ({ many }) => ({
  subcategories: many(subcategories),
  businesses: many(businesses),
  businessTypeCategoryMap: many(businessTypeCategoryMap),
  staffAssignments: many(staffAssignments),
  advertisements: many(advertisements, { relationName: "targetCategory" }),
}));

export const subcategoriesRelations = relations(
  subcategories,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [subcategories.categoryId],
      references: [categories.id],
    }),
    businesses: many(businesses),
  })
);

export const businessTypeCategoryMapRelations = relations(
  businessTypeCategoryMap,
  ({ one }) => ({
    category: one(categories, {
      fields: [businessTypeCategoryMap.categoryId],
      references: [categories.id],
    }),
  })
);

// ─── Businesses ───────────────────────────────────────────────────────────────

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, {
    fields: [businesses.ownerId],
    references: [users.id],
  }),
  category: one(categories, {
    fields: [businesses.categoryId],
    references: [categories.id],
  }),
  subcategory: one(subcategories, {
    fields: [businesses.subcategoryId],
    references: [subcategories.id],
  }),
  city: one(cities, { fields: [businesses.cityId], references: [cities.id] }),
  state: one(states, {
    fields: [businesses.stateId],
    references: [states.id],
  }),
  meta: many(businessMeta),
  serviceAreas: many(serviceAreas),
  tags: many(businessTags),
  hours: many(businessHours),
  gallery: many(businessGallery),
  videos: many(businessVideos),
  socialLinks: many(businessSocialLinks),
  verification: one(businessVerifications, {
    fields: [businesses.id],
    references: [businessVerifications.businessId],
  }),
  reviews: many(reviews),
  leads: many(leads),
  subscriptions: many(subscriptions),
  payments: many(payments),
  favorites: many(favorites),
  recentlyViewed: many(recentlyViewed),
  advertisements: many(advertisements),
}));

export const businessMetaRelations = relations(businessMeta, ({ one }) => ({
  business: one(businesses, {
    fields: [businessMeta.businessId],
    references: [businesses.id],
  }),
}));

export const serviceAreasRelations = relations(serviceAreas, ({ one }) => ({
  business: one(businesses, {
    fields: [serviceAreas.businessId],
    references: [businesses.id],
  }),
  city: one(cities, {
    fields: [serviceAreas.cityId],
    references: [cities.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  businessTags: many(businessTags),
}));

export const businessTagsRelations = relations(businessTags, ({ one }) => ({
  business: one(businesses, {
    fields: [businessTags.businessId],
    references: [businesses.id],
  }),
  tag: one(tags, { fields: [businessTags.tagId], references: [tags.id] }),
}));

// ─── Business Media ───────────────────────────────────────────────────────────

export const businessHoursRelations = relations(businessHours, ({ one }) => ({
  business: one(businesses, {
    fields: [businessHours.businessId],
    references: [businesses.id],
  }),
}));

export const businessGalleryRelations = relations(
  businessGallery,
  ({ one }) => ({
    business: one(businesses, {
      fields: [businessGallery.businessId],
      references: [businesses.id],
    }),
    approvedByUser: one(users, {
      fields: [businessGallery.approvedBy],
      references: [users.id],
    }),
  })
);

export const businessVideosRelations = relations(businessVideos, ({ one }) => ({
  business: one(businesses, {
    fields: [businessVideos.businessId],
    references: [businesses.id],
  }),
}));

export const businessSocialLinksRelations = relations(
  businessSocialLinks,
  ({ one }) => ({
    business: one(businesses, {
      fields: [businessSocialLinks.businessId],
      references: [businesses.id],
    }),
  })
);

// ─── Verifications ────────────────────────────────────────────────────────────

export const businessVerificationsRelations = relations(
  businessVerifications,
  ({ one, many }) => ({
    business: one(businesses, {
      fields: [businessVerifications.businessId],
      references: [businesses.id],
    }),
    verifiedByUser: one(users, {
      fields: [businessVerifications.verifiedBy],
      references: [users.id],
      relationName: "verifiedBusinesses",
    }),
    documents: many(verificationDocuments),
    statusHistory: many(verificationStatusHistory),
  })
);

export const verificationDocumentsRelations = relations(
  verificationDocuments,
  ({ one }) => ({
    verification: one(businessVerifications, {
      fields: [verificationDocuments.verificationId],
      references: [businessVerifications.id],
    }),
    verifiedByUser: one(users, {
      fields: [verificationDocuments.verifiedBy],
      references: [users.id],
    }),
  })
);

export const verificationStatusHistoryRelations = relations(
  verificationStatusHistory,
  ({ one }) => ({
    verification: one(businessVerifications, {
      fields: [verificationStatusHistory.verificationId],
      references: [businessVerifications.id],
    }),
    changedByUser: one(users, {
      fields: [verificationStatusHistory.changedBy],
      references: [users.id],
    }),
  })
);

// ─── Reviews ──────────────────────────────────────────────────────────────────

export const reviewsRelations = relations(reviews, ({ one, many }) => ({
  business: one(businesses, {
    fields: [reviews.businessId],
    references: [businesses.id],
  }),
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  approvedByUser: one(users, {
    fields: [reviews.approvedBy],
    references: [users.id],
    relationName: "approvedReviews",
  }),
  images: many(reviewImages),
  reply: one(reviewReplies, {
    fields: [reviews.id],
    references: [reviewReplies.reviewId],
  }),
  helpfulVotes: many(reviewHelpfulVotes),
}));

export const reviewImagesRelations = relations(reviewImages, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewImages.reviewId],
    references: [reviews.id],
  }),
}));

export const reviewRepliesRelations = relations(reviewReplies, ({ one }) => ({
  review: one(reviews, {
    fields: [reviewReplies.reviewId],
    references: [reviews.id],
  }),
  user: one(users, {
    fields: [reviewReplies.userId],
    references: [users.id],
  }),
}));

export const reviewHelpfulVotesRelations = relations(
  reviewHelpfulVotes,
  ({ one }) => ({
    review: one(reviews, {
      fields: [reviewHelpfulVotes.reviewId],
      references: [reviews.id],
    }),
    user: one(users, {
      fields: [reviewHelpfulVotes.userId],
      references: [users.id],
    }),
  })
);

// ─── Leads ────────────────────────────────────────────────────────────────────

export const leadsRelations = relations(leads, ({ one, many }) => ({
  business: one(businesses, {
    fields: [leads.businessId],
    references: [businesses.id],
  }),
  submittedByUser: one(users, {
    fields: [leads.submittedByUserId],
    references: [users.id],
  }),
  assignedToUser: one(users, {
    fields: [leads.assignedTo],
    references: [users.id],
    relationName: "assignedLeads",
  }),
  statusHistory: many(leadStatusHistory),
  notes: many(leadNotes),
}));

export const leadStatusHistoryRelations = relations(
  leadStatusHistory,
  ({ one }) => ({
    lead: one(leads, {
      fields: [leadStatusHistory.leadId],
      references: [leads.id],
    }),
    changedByUser: one(users, {
      fields: [leadStatusHistory.changedBy],
      references: [users.id],
    }),
  })
);

export const leadNotesRelations = relations(leadNotes, ({ one }) => ({
  lead: one(leads, { fields: [leadNotes.leadId], references: [leads.id] }),
  user: one(users, { fields: [leadNotes.userId], references: [users.id] }),
}));

// ─── Subscriptions & Payments ─────────────────────────────────────────────────

export const packagesRelations = relations(packages, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    business: one(businesses, {
      fields: [subscriptions.businessId],
      references: [businesses.id],
    }),
    package: one(packages, {
      fields: [subscriptions.packageId],
      references: [packages.id],
    }),
    payments: many(payments),
    advertisements: many(advertisements),
  })
);

export const paymentsRelations = relations(payments, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [payments.subscriptionId],
    references: [subscriptions.id],
  }),
  user: one(users, { fields: [payments.userId], references: [users.id] }),
  business: one(businesses, {
    fields: [payments.businessId],
    references: [businesses.id],
  }),
}));

// ─── Advertisements ───────────────────────────────────────────────────────────

export const advertisementsRelations = relations(
  advertisements,
  ({ one, many }) => ({
    business: one(businesses, {
      fields: [advertisements.businessId],
      references: [businesses.id],
    }),
    subscription: one(subscriptions, {
      fields: [advertisements.subscriptionId],
      references: [subscriptions.id],
    }),
    createdByUser: one(users, {
      fields: [advertisements.createdBy],
      references: [users.id],
    }),
    approvedByUser: one(users, {
      fields: [advertisements.approvedBy],
      references: [users.id],
    }),
    targetCategory: one(categories, {
      fields: [advertisements.targetCategoryId],
      references: [categories.id],
      relationName: "targetCategory",
    }),
    targetCity: one(cities, {
      fields: [advertisements.targetCityId],
      references: [cities.id],
      relationName: "targetCity",
    }),
    banners: many(bannerAds),
    impressionsLog: many(adImpressionsLog),
  })
);

export const bannerAdsRelations = relations(bannerAds, ({ one }) => ({
  advertisement: one(advertisements, {
    fields: [bannerAds.advertisementId],
    references: [advertisements.id],
  }),
}));

export const adImpressionsLogRelations = relations(
  adImpressionsLog,
  ({ one }) => ({
    advertisement: one(advertisements, {
      fields: [adImpressionsLog.advertisementId],
      references: [advertisements.id],
    }),
    user: one(users, {
      fields: [adImpressionsLog.userId],
      references: [users.id],
    }),
  })
);

// ─── Platform ─────────────────────────────────────────────────────────────────

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, { fields: [auditLogs.actorId], references: [users.id] }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  business: one(businesses, {
    fields: [favorites.businessId],
    references: [businesses.id],
  }),
}));

export const searchHistoryRelations = relations(searchHistory, ({ one }) => ({
  user: one(users, {
    fields: [searchHistory.userId],
    references: [users.id],
  }),
}));

export const recentlyViewedRelations = relations(recentlyViewed, ({ one }) => ({
  user: one(users, {
    fields: [recentlyViewed.userId],
    references: [users.id],
  }),
  business: one(businesses, {
    fields: [recentlyViewed.businessId],
    references: [businesses.id],
  }),
}));
