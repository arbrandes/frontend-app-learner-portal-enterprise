import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Container } from '@openedx/paragon';
import { useEnterpriseCustomer } from '../app/data';

const NotFoundPage = ({ pageTitle, errorHeading, errorMessage }) => {
  const { data: enterpriseCustomer } = useEnterpriseCustomer();

  let PAGE_TITLE = pageTitle;
  if (enterpriseCustomer) {
    PAGE_TITLE += ` - ${enterpriseCustomer.name}`;
  }

  return (
    <Container size="lg" className="mt-3" data-testid="not-found-page">
      <Helmet title={PAGE_TITLE} />
      <div className="text-center py-5">
        <h1>404</h1>
        <p className="lead">{errorHeading}</p>
        <p>{errorMessage}</p>
      </div>
    </Container>
  );
};

NotFoundPage.defaultProps = {
  pageTitle: 'Page not found',
  errorHeading: "Oops, sorry we can't find that page!",
  errorMessage: "Either something went wrong or the page doesn't exist anymore.",
};

NotFoundPage.propTypes = {
  pageTitle: PropTypes.string,
  errorHeading: PropTypes.string,
  errorMessage: PropTypes.string,
};

export default NotFoundPage;
