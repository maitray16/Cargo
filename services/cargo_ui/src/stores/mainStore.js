import {observable,action} from 'mobx';
import commonStore from './commonStore';
import {post} from '../utils/apiUtils';
import fileDownload from 'js-file-download';

class MainStore {

    @observable host = '';
    @observable connection_state = 'Connect';
    @observable indexValue = null;
    @observable fieldValue = null;
    @observable indexList = [];
    @observable fieldList = [];
    @observable editorString = '{\n\t "query": {\n\t\t"match_all": {} \n\t}\n}';
    @observable countText = 'Check doc count';
    @observable isTimeRangeVisible = false;
    @observable dropdownOpen = new Array(19).fill(false);
    @observable loading = false;

    @action setHost(e) {
        this.host = e;
    }

    @action reset() {
        this.host = '';
        this.connection_state = 'Connect';
        this.indexValue = null;
        this.fieldValue = null;
        this.indexList = [];
        this.fieldList = [];
        this.countText = 'Check doc count';
        if(this.connection_state === 'Connected')
            commonStore.setSnackError("Connection Ended", "Reset");
    }

    @action setIndex(e) {
        this.indexValue = e;
        if (e === null) {
            this.fieldList = [];
            this.countText = 'Check doc count';
        }
        else {
            this.fieldList = [];
            this.countText = 'Check doc count';
            this.getMappingList(e);
        }
    }

    @action setMapping(e) {
        this.fieldValue = e;
    }

    @action setEditorString(e) {
        this.editorString = e;
    }

    @action connect() {
        post('/connect', {host: this.host})
        .then(response => {
            this.getIndexList();
            this.connection_state = 'Connected';
        })
        .catch((err) => {
            throw err;
        })
        
    }

    @action getIndexList() {
        post('/index', {
                host: this.host
            })
            .then(response => {
                this.indexList = response.data.data;
            })
            .catch((err) => {
                throw err;
            })
    }

    @action getMappingList(index) {
        post('/mapping', {
                host: this.host,
                index: index
            })
            .then(response => {
                this.fieldList = response.data.data;
            })
            .catch((err) => {
                throw err;
            })
    }

    @action getDocCount() {
        if(this.indexValue === null){
            commonStore.setSnackError("Please select index", "Index Error");
        }
        else if(this.editorString === ''){
            commonStore.setSnackError("Please enter a query", "Query Error");
        }
        else{
            this.countText = 'Cruncing numbers';
            post('/doc_count', {
                host: this.host,
                index: this.indexValue
            })
            .then(response => {
                this.countText = "Doc Count = " + response.data.data;
            })
            .catch((err) => {
                throw err;
            })
        }
    }

    @action export (type) {
        if(this.indexValue === null){
            commonStore.setSnackError("Please select index", "Index Error");
        }
        else if(this.editorString === ''){
            commonStore.setSnackError("Please enter a query", "Query Error");
        }
        else{
            this.loading = true;
            let fields = null;
            if(this.fieldValue === null)
                fields = this.fieldList;
            else
                fields = this.fieldValue;
            
            post('/export', {
                    host: this.host,
                    index: this.indexValue.split(','),
                    fields: fields,
                    query: this.editorString,
                    type: type
                }).then(response => {
                    this.loading = false;
                    if (type === 'csv') {
                        fileDownload(response.data, this.indexValue + "-" + this._generateID() + ".csv");
                    } else if (type === 'mongo') {
                        fileDownload(response.data, this.indexValue + "-" + this._generateID() + "-instructions.txt");
                    }
                })
                .catch(error => {
                    console.log(error);
                })    
        }
    }

    @action timeRangeToggle() {
        if (this.isTimeRangeVisible)
            this.isTimeRangeVisible = false;
        else
            this.isTimeRangeVisible = true;
    }

    @action toggle(i) {
        const newArray = this.dropdownOpen.map((element, index) => {
            return (index === i ? !element : false);
        });
        this.dropdownOpen = newArray;
    }

    _generateID() {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 4; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

}

export default new MainStore();