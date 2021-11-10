import React from 'react';
import PropTypes from 'prop-types';
import { Hits, connectStateResults } from 'react-instantsearch-dom';
import Skeleton from 'react-loading-skeleton';

import { useNbHitsFromSearchResults } from '@edx/frontend-enterprise-catalog-search';
import SearchCourseCard from '../SearchCourseCard';
import SearchProgramCard from '../SearchProgramCard';
import SearchError from '../SearchError';
import { COURSE_TITLE } from '../constants';

import { isDefinedAndNotNull } from '../../../utils/common';
import { NUM_RESULTS_TO_DISPLAY } from './data/constants';

const PopularCourses = ({
  searchResults,
  isSearchStalled,
  error,
  title,
}) => {
  const nbHits = useNbHitsFromSearchResults(searchResults);

  return (
    <>
      <h2 className="mb-4">
        {isSearchStalled && (
          <Skeleton className="h2 d-block mb-3" width={240} />
        )}
        {!isSearchStalled && (
          <>{`Popular ${title}`}</>
        )}
      </h2>
      {isSearchStalled && (
        <div className="row">
          {[...Array(NUM_RESULTS_TO_DISPLAY).keys()].map(resultNum => (
            <div key={resultNum} className="skeleton-course-card">
              <SearchCourseCard.Skeleton />
            </div>
          ))}
        </div>
      )}
      {!isSearchStalled && nbHits > 0 && (
        <Hits hitComponent={title === COURSE_TITLE ? SearchCourseCard : SearchProgramCard} />
      )}
      {!isSearchStalled && isDefinedAndNotNull(error) && (
        <SearchError />
      )}
    </>
  );
};

PopularCourses.propTypes = {
  searchResults: PropTypes.shape(),
  isSearchStalled: PropTypes.bool,
  error: PropTypes.shape(),
  title: PropTypes.string.isRequired,
};

PopularCourses.defaultProps = {
  searchResults: undefined,
  isSearchStalled: false,
  error: undefined,
};

export default connectStateResults(PopularCourses);
