// importer/handlers/Constituents.ts

import { prisma } from "../utils/batch";

export async function handleConstituents(rows: { AccountNumber: any; Type: any; Status: any; First: any; Middle: any; Last: any; FullName: any; InformalName: any; FormalName: any; RecognitionName: any; SortName: any; Prefix: any; Suffix: any; Birthdate: string | number | Date; JobTitle: any; Employer: any; Website: any; FacebookId: any; TwitterId: any; LinkedInId: any; EnvelopeName: any; CommunicationChannelPreferred: any; LastModifiedDate: string | number | Date; LastModifiedName: any; CreatedDate: string | number | Date; CreatedName: any; }[]) {
  const mapped = rows.map((r: { AccountNumber: any; Type: any; Status: any; First: any; Middle: any; Last: any; FullName: any; InformalName: any; FormalName: any; RecognitionName: any; SortName: any; Prefix: any; Suffix: any; Birthdate: string | number | Date; JobTitle: any; Employer: any; Website: any; FacebookId: any; TwitterId: any; LinkedInId: any; EnvelopeName: any; CommunicationChannelPreferred: any; LastModifiedDate: string | number | Date; LastModifiedName: any; CreatedDate: string | number | Date; CreatedName: any; }) => ({
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
  });
}
