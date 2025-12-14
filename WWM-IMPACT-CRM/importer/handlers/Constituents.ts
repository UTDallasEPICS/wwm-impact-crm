import prisma from '../../lib/prisma';

export async function handleConstituents(rows: any[]) {
  const mapped = rows.map((r) => ({
    accountNumber: r.AccountNumber, // unique key
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

  const upsertPromises = mapped.map(record =>
    prisma.constituent.upsert({
      where: { accountNumber: record.accountNumber }, // using unique key to identify records
      update: {
        accountNumber: record.accountNumber,
        type: record.type,
        status: record.status,
        firstName: record.firstName,
        middleName: record.middleName,
        lastName: record.lastName,
        fullName: record.fullName,
        informalName: record.informalName,
        formalName: record.formalName,
        recognitionName: record.recognitionName,
        sortName: record.sortName,
        prefix: record.prefix,
        suffix: record.suffix,
        birthdate: record.birthdate,
        jobTitle: record.jobTitle,
        employer: record.employer,
        website: record.website,
        facebookId: record.facebookId,
        twitterId: record.twitterId,
        linkedInId: record.linkedInId,
        envelopeName: record.envelopeName,
        communicationChannelPreferred: record.communicationChannelPreferred,
        lastModifiedDate: record.lastModifiedDate,
        lastModifiedName: record.lastModifiedName,
        createdDate: record.createdDate,
        createdName: record.createdName,
      },
      create: record,
    })
  );

  const transaction = await prisma.$transaction(upsertPromises);
  return transaction.length;
}
