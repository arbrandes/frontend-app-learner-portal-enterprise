import React, { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Configure, InstantSearch } from 'react-instantsearch-dom';
import { AppContext } from '@edx/frontend-platform/react';
import { getConfig } from '@edx/frontend-platform/config';
import { SearchHeader, SearchContext } from '@edx/frontend-enterprise-catalog-search';

import { useDefaultSearchFilters } from './data/hooks';
import {
  NUM_RESULTS_PER_PAGE, CONTENT_TYPE_COURSE, CONTENT_TYPE_PROGRAM, COURSE_TITLE, PROGRAM_TITLE,
} from './constants';
import SearchProgram from './SearchProgram';
import SearchCourse from './SearchCourse';
import SearchCourseCard from './SearchCourseCard';
import SearchProgramCard from './SearchProgramCard';
import SearchResults from './SearchResults';

import { IntegrationWarningModal } from '../integration-warning-modal';
import { UserSubsidyContext } from '../enterprise-user-subsidy';

const Search = () => {
  const { refinements: { content_type: contentType } } = useContext(SearchContext);
  const { enterpriseConfig, algolia } = useContext(AppContext);
  const { subscriptionPlan, subscriptionLicense, offers: { offers } } = useContext(UserSubsidyContext);
  const offerCatalogs = offers.map((offer) => offer.catalog);
  const { filters } = useDefaultSearchFilters({
    enterpriseConfig,
    subscriptionPlan,
    subscriptionLicense,
    offerCatalogs,
  });

  const config = getConfig();

  const PAGE_TITLE = `Search Courses and Programs - ${enterpriseConfig.name}`;

  return (
    <>
      <Helmet title={PAGE_TITLE} />
      <InstantSearch
        indexName={config.ALGOLIA_INDEX_NAME}
        searchClient={algolia.client}
      >
        {contentType?.length > 0 && (
          <Configure
            hitsPerPage={NUM_RESULTS_PER_PAGE}
            filters={`content_type:${contentType[0]} AND ${filters}`}
            clickAnalytics
          />
        )}
        <div className="search-header-wrapper">
          <SearchHeader containerSize="lg" />
        </div>

        { (contentType === undefined || contentType.length === 0) && (
          <>
            <SearchProgram filter={filters} />
            <SearchCourse filter={filters} />
          </>
        )}

        { contentType?.length > 0 && contentType[0] === CONTENT_TYPE_PROGRAM && (
          <SearchResults hitComponent={SearchProgramCard} title={PROGRAM_TITLE} contentType={CONTENT_TYPE_PROGRAM} />
        )}

        { contentType?.length > 0 && contentType[0] === CONTENT_TYPE_COURSE && (
          <SearchResults hitComponent={SearchCourseCard} title={COURSE_TITLE} contentType={CONTENT_TYPE_COURSE} />
        )}
      </InstantSearch>
      <IntegrationWarningModal isOpen={enterpriseConfig.showIntegrationWarning} />
    </>
  );
};

export default Search;
