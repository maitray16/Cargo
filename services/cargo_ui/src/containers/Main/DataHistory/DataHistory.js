import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { CardHeader, Card, CardBody } from 'reactstrap';
import ReactTable from "react-table";
import "react-table/react-table.css";

const cardHeaderColor = '#52616a';
const cardHeaderTextColor = '#fff';
const cardHeaderStyle = {background: cardHeaderColor, color: cardHeaderTextColor};

@inject('commonStore')
@observer
export default class DataHistory extends Component{
    
    constructor(props) {
        super(props);
        this.props.commonStore.getDataHistory();
    }

    render(){
        const columns = [
            {
                Header: 'Host',
                accessor: 'host' 
            }, 
            {
                Header: 'Index',
                accessor: 'index',
            },
            {
                Header: 'Fields',
                accessor: 'fields',
            },
            {
                Header: 'Type',
                accessor: 'type',
            },
            {
                Header: 'Query',
                accessor: 'query',
            }
          ]

        return(
            <div className="animated fadeIn">
                <Card>
                    <CardHeader style={cardHeaderStyle}>
                        <i className="fa fa-history"></i><strong>Export</strong> History
                    </CardHeader>
                    <CardBody>
                    <ReactTable
                        data={this.props.commonStore.history}
                        columns={columns}
                        defaultPageSize={10}
                        className="-highlight"
                        
                    />
                    </CardBody>
                </Card>
            </div>
        );
    }
}