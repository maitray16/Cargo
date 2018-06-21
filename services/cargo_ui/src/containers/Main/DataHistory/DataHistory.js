import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { CardHeader, Card, CardBody } from 'reactstrap';

const cardHeaderColor = '#52616a';
const cardHeaderTextColor = '#fff';
const cardHeaderStyle = {background: cardHeaderColor, color: cardHeaderTextColor};

@inject('mainStore')
@observer
export default class DataHistory extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <div className="animated fadeIn">
                <Card>
                    <CardHeader style={cardHeaderStyle}>
                        <i className="fa fa-history"></i><strong>Export</strong> History
                    </CardHeader>
                    <CardBody>
                    </CardBody>
                </Card>
            </div>
        );
    }
}