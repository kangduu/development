import React from 'react';
import FileViewer from 'react-file-viewer';


const wo=require('./123.pdf');
function ReactPdf() {

    return (
        <div>
            <FileViewer fileType='pdf'
                filePath={wo}
                // onError={this.onError.bind(this)}
                errorComponent={console.log("出现错误")}
                unsupportedComponent={console.log("不支持")}
            />
        </div>
    );
}

export default ReactPdf