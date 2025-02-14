import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Badge, Card } from '@openedx/paragon';
import { useParams } from 'react-router-dom';
import capitalize from 'lodash.capitalize';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import { CONTENT_TYPES, IN_PROGRESS } from './constants';
import { getLinkToCourse, shortenString } from '../course/data/utils';

const PathwayNode = ({ node }) => {
  const { enterpriseSlug } = useParams();

  const linkToNode = useMemo(
    // eslint-disable-next-line consistent-return
    () => {
      if (node.contentType === CONTENT_TYPES.COURSE) {
        return getLinkToCourse(node, enterpriseSlug);
      }
      if (node.contentType === CONTENT_TYPES.PROGRAM) {
        return `/${enterpriseSlug}/program/${node.uuid}`;
      }
      return '#';
    },
    [node, enterpriseSlug],
  );

  const description = useMemo(
    () => shortenString(node.shortDescription, 250, '...'),
    [node],
  );

  return (
    <div className="pathway-node">
      <div className="row-cols-1 pathway-node-card">
        <Card className="w-100">
          <Card.Section>
            <div className="row d-flex align-items-center">
              <div className="col-3">
                <img src={node.cardImageUrl} alt={node.title} />
              </div>
              <div className="col-7">
                <div className="row">
                  <h3>{node.title}</h3>{' '}
                  {node.status === IN_PROGRESS && (
                    <Badge variant="success">
                      <FormattedMessage
                        id="enterprise.dashboard.pathways.progress.page.pathway.node.in.progress.badge"
                        defaultMessage="In progress"
                        description="In progress badge label displayed for a pathway card on the pathway progress page."
                      />
                    </Badge>
                  )}
                </div>
                <p
                  className="row lead font-weight-normal"
                  // eslint-disable-next-line react/no-danger
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
              <div className="col-2">
                {
                  node.status === IN_PROGRESS ? (
                    <a href={linkToNode} type="button" className="btn btn-primary">
                      <FormattedMessage
                        id="enterprise.dashboard.pathways.progress.page.pathway.node.resume.course.or.program.button.text"
                        defaultMessage="Resume {contentType}"
                        description="Button text for resuming a course or program on the pathway card within the pathway progress page."
                        values={{
                          contentType: capitalize(node.contentType),
                        }}
                      />

                    </a>
                  ) : (
                    <a href={linkToNode} type="button" className="btn btn-secondary">
                      <FormattedMessage
                        id="enterprise.dashboard.pathways.progress.page.pathway.node.view.course.or.program.button.text"
                        defaultMessage="View {contentType}"
                        description="Button text for viewing a course or program on the pathway card within the pathway progress page."
                        values={{
                          contentType: capitalize(node.contentType),
                        }}
                      />
                    </a>
                  )
                }
              </div>
            </div>
          </Card.Section>
        </Card>
      </div>
    </div>
  );
};

export default PathwayNode;

PathwayNode.propTypes = {
  node: PropTypes.shape({
    title: PropTypes.string,
    key: PropTypes.string,
    uuid: PropTypes.string,
    shortDescription: PropTypes.string,
    cardImageUrl: PropTypes.string,
    destinationUrl: PropTypes.string,
    contentType: PropTypes.string,
    status: PropTypes.string,
  }).isRequired,
};
