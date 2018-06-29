import React, { Component } from "react";
import { Container, Col, Row } from "reactstrap";
import Connect from "./Connect/Connect";
import Export from "./Export/Export";
import Header from "./Extras/Header";
import Footer from "./Extras/Footer";
import DataHistory from "./DataHistory/DataHistory";
import NotificationSystem from "react-notification-system";
import { autorun } from "mobx";
import { inject, observer } from "mobx-react";

const appSidebarColor = "#1e272e";
const appSidebarStyle = { background: appSidebarColor };

@inject("commonStore")
@observer
export default class Main extends Component {
  mobxHook = autorun(() => {
    if (this.props.commonStore.snackMessage.message !== null) {
      this.refs.notificationSystem.addNotification(
        this.props.commonStore.snackMessage
      );
      this.props.commonStore.setSnackMessage();
    }
  });

  render() {
    return (
      <div className="app">
        <Header style={appSidebarStyle} />
        <div className="app-body">
          <main className="main">
            <Container fluid style={{ marginTop: "2%" }}>
              <div className="animated fadeIn">
                <NotificationSystem ref="notificationSystem" />

                <Row>
                  <Col>
                    <Connect />
                  </Col>
                </Row>

                <Row />

                <Row>
                  <Col md="12">
                    <Export />
                  </Col>
                </Row>

                <Row>
                  <Col md="12">
                    <DataHistory />
                  </Col>
                </Row>
              </div>
            </Container>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
}
