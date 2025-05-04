import React, { useEffect, useState } from 'react';
import { Col, Row } from 'reactstrap';
import Cookies from 'js-cookie';

const Section = (props) => {
    const [firstName, setFirstName] = useState('');

    useEffect(() => {
        // Get the 'user' object from cookies and parse it
        const user = Cookies.get('user');
        if (user) {
            const parsedUser = JSON.parse(user);
            if (parsedUser.first_name) {
                setFirstName(parsedUser.first_name);
            }
        }
    }, []);

    return (
        <React.Fragment>
            <Row className="mb-3 pb-1">
                <Col xs={12}>
                    <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                        <div className="flex-grow-1">
                            <h4 className="fs-16 mb-1">Welcome {firstName || 'Guest'}</h4>
                            <p className="text-muted mb-0">Here’s what’s happening today in your healthcare journey!</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Section;
