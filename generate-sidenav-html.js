'use strict';


const verSlugs = require('./pages/_data/versions.json').map(e => e.slug);

const allDomains = {};

for (const slug of verSlugs){
  const protocol = require(`./pages/_data/${slug}/protocol.json`);
  const domains = protocol.domains;
  domains.forEach(domain => {
    const id = domain.domain;
    const tags = allDomains[id] || [];
    tags.push(slug);

    // Annotate with tot's experimental / deprecated status
    if (slug === 'tot') {
      if (domain.experimental) tags.push('experimental');
      if (domain.deprecated) tags.push('deprecated');
    }
    allDomains[id] = tags;
  });
}

const str = Object.entries(allDomains).sort(([domainA, tagsA], [domainB, tagsB]) => {
    const isExpOrDepr = a => a === 'experimental' || a === 'deprecated';
    const getTagsStr = tags => tags.filter(isExpOrDepr).join('');
    const tagSortResult = getTagsStr(tagsA).localeCompare(getTagsStr(tagsB));
    if (tagSortResult !== 0) return tagSortResult;
    return domainA.localeCompare(domainB);
  })
  .map(([id, versions]) => `<a data-title="${id}" class="${versions.join(' ')}">${id}</a>`)
  .join('\n');


process.stdout.write(str + '\n');
