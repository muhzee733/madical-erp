import React, { useState } from "react";
import { Col, Dropdown, DropdownMenu, DropdownToggle, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, clearCart } from "../../slices/cart/reducer";
import SimpleBar from "simplebar-react";

// A simple loader component
const Loader = () => (
  <div className="text-center p-4">
    <div className="spinner-border text-info" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const MyCartDropdown = () => {
  const dispatch = useDispatch();
  const { items = [], isLoading } = useSelector((state) => state.Cart || {});

  const [isCartDropdown, setIsCartDropdown] = useState(false);

  const toggleCartDropdown = () => {
    setIsCartDropdown(!isCartDropdown);
  };

  return (
    <React.Fragment>
      <Dropdown
        isOpen={isCartDropdown}
        toggle={toggleCartDropdown}
        className="topbar-head-dropdown ms-1 header-item"
      >
        <DropdownToggle
          type="button"
          tag="button"
          className="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
        >
          <i className="bx bx-shopping-bag fs-22"></i>
          <span className="position-absolute topbar-badge fs-10 translate-middle badge rounded-pill bg-info">
            {items.length}
          </span>
        </DropdownToggle>

        <DropdownMenu
          className="dropdown-menu-xl dropdown-menu-end p-0 dropdown-menu-cart"
          aria-labelledby="page-header-cart-dropdown"
        >
          <div className="p-3 border-top-0 border-start-0 border-end-0 border-dashed border">
            <Row className="align-items-center">
              <Col>
                <h6 className="m-0 fs-16 fw-semibold">My Cart</h6>
              </Col>
              <div className="col-auto">
                <span className="badge bg-warning-subtle text-warning fs-13">
                  {items.length} items
                </span>
              </div>
            </Row>
          </div>

          {/* Loader OR Cart Items */}
          {isLoading ? (
            <Loader />
          ) : (
            <SimpleBar style={{ maxHeight: "300px" }}>
              <div className="p-2">
                {items.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="avatar-md mx-auto mb-3">
                      <div className="avatar-title bg-info-subtle text-info fs-36 rounded-circle">
                        <i className="bx bx-cart"></i>
                      </div>
                    </div>
                    <h5 className="mb-0">No Appointments Booked</h5>
                  </div>
                ) : (
                  items.map((item, key) => (
                    <div
                      className="d-block dropdown-item text-wrap dropdown-item-cart px-3 py-2"
                      key={key}
                    >
                      <div className="d-flex align-items-center">
                        <div className="flex-grow-1">
                          <h6 className="mt-0 mb-1 fs-14">Date - {item.date}</h6>
                          <p className="mb-0 fs-12 text-muted">
                            Appointment: {item.start_time} to {item.end_time}
                          </p>
                        </div>
                        <div className="px-2">
                          <h5 className="m-0 fw-normal">$100</h5>
                        </div>
                        <div className="ps-2">
                          <button
                            type="button"
                            className="btn btn-icon btn-sm btn-ghost-danger remove-item-btn"
                            onClick={() => dispatch(removeFromCart({ id: item.id }))}

                          >
                            <i className="ri-close-fill fs-16"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </SimpleBar>
          )}

          {/* Checkout button only if cart has items */}
          {items.length > 0 && !isLoading && (
            <div className="p-3 border-bottom-0 border-start-0 border-end-0 border-dashed border">
              <div className="d-flex justify-content-between align-items-center pb-3">
                <h5 className="m-0 text-muted">Total:</h5>
                <div className="px-2">
                  <h5 className="m-0">
                    $<span id="cart-item-total">3400</span>
                  </h5>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn btn-success text-center w-100"
              >
                Checkout
              </Link>
            </div>
          )}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  );
};

export default MyCartDropdown;
