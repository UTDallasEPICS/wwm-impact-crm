// importer/handlers/Constituents.ts

import { prisma } from "../utils/batch";

export async function handleConstituents(rows) {
  const mapped = rows.map(r => ({
    accountNumber: r.AccountNumber,
    type: r.Type ?? null,
    status: r.Status ?? null,
    firstName: r.First ?? null,
    middleName: r.Middle ?? null,
    lastName: r.Last ?? null,
    fullName: r.FullName ?? null,
    informalName: r.InformalName ?? null,
    formalName: r.FormalName ?? null,
    recognitionName: r.RecognitionName ?? null,
    sortName: r.SortName ?? null,
    prefix: r.Prefix ?? null,
    suffix: r.Suffix ?? null,
    birthdate: r.Birthdate ? new Date(r.Birthdate) : null,
    jobTitle: r.JobTitle ?? null,
    employer: r.Employer ?? null,
    website: r.Website ?? null,
    facebookId: r.FacebookId ?? null,
    twitterId: r.TwitterId ?? null,
    linkedInId: r.LinkedInId ?? null,
    envelopeName: r.EnvelopeName ?? null,
    communicationChannelPreferred: r.CommunicationChannelPreferred ?? null,
    lastModifiedDate: r.LastModifiedDate ? new Date(r.LastModifiedDate) : null,
    lastModifiedName: r.LastModifiedName ?? null,
    createdDate: r.CreatedDate ? new Date(r.CreatedDate) : null,
    createdName: r.CreatedName ?? null,
  }));

  await prisma.constituent.createMany({
    data: mapped,
    skipDuplicates: true,
  });
}
