import { observable, action } from 'mobx';
import hostStore from './hostStore'; 
import { post } from '../apiUtils';
import fileDownload from 'js-file-download';

class ExportStore {
    
    @observable indexValue = '';
    @observable fieldValue = '';
    @observable indexList = [];
    @observable fieldList = [];

    @observable editorString = '{\n\t "query": {\n\t\t"match_all": {} \n\t}\n}';
    @observable countText = 'Check doc count';

    @observable isTimeRangeVisible = false;
    @observable dropdownOpen = new Array(19).fill(false);
    @observable loading = false;

    @action setIndex(e){
        this.indexValue = e;
        if(e === '')
            this.fieldList = [];
        else {
            this.fieldList = [];
            this.getMappingList(e);
        }
    }

    @action setMapping(e){
        this.fieldValue = e;
    }

    @action setEditorString(e){
        this.editorString = e;
    }

    @action getIndexList(){
        post('/index', {host: hostStore.host})
        .then(response => {
            this.indexList = response.data.data;
        })
        .catch((err) => {
            throw err;
        })
    }

    @action getMappingList(index){
        post('/mapping', {host: hostStore.host, index: index})
        .then(response => {
            this.fieldList = response.data.data;
        })
        .catch((err) => {
            throw err;
        })
    }

    @action getDocCount(){
        this.countText = 'Cruncing numbers';
        post('/doc_count', {host: hostStore.host, index: this.indexValue})
        .then(response => {
            this.countText = "Doc Count = " + response.data.data;
        })
        .catch((err) => {
            throw err;
        })
    }

    @action export(type){
        this.loading = true;
        post('/export',{ host: hostStore.host, index: this.indexValue.split(','),
            fields: this.fieldValue.split(','), query: this.editorString, type: type
            }).then(response => {
              this.loading = false;
              if(type === 'csv'){
                  fileDownload(response.data, this.indexValue + "-" + this._generateID() + ".csv");
              }
              else if(type === 'mongo'){
                  fileDownload(response.data, this.indexValue + "-" + this._generateID() + "-instructions.txt");
              }
            })
        .catch(error => {
            console.log(error);
        })

    }

    @action timeRangeToggle(){
        if(this.isTimeRangeVisible)
            this.isTimeRangeVisible = false;
        else
            this.isTimeRangeVisible = true;
    }

    @action toggle(i){
        const newArray = this.dropdownOpen.map((element, index) => { return (index === i ? !element : false); });
        this.dropdownOpen = newArray;
    }
    
    _generateID(){
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 4; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
      }
    
  


}

export default new ExportStore();