
(() => {

    console.log('Content script works!');
    console.log('Must reload extension for modifications to take effect.');

    const getHTMLTable = () => {
        let htmlTable = document.getElementsByClassName('ms-table')[0];
        let jsonTable = tableToJson(htmlTable)
        let totalMoney = document.getElementsByClassName('summary-info-number')[0].innerText
        let purchaseId = document.getElementsByClassName('title')[0].innerText
        let purchaserName = document.getElementsByClassName('basic-information')[0].getElementsByTagName('input')[5].value
        let providerName = document.getElementsByClassName('basic-information')[0].getElementsByTagName('input')[0].value
        return { jsonTable, totalMoney, purchaseId, purchaserName, providerName }
    }

    function tableToJson(table) {
        var data = [];
        var headers = []
        for (var i = 0; i < table.tHead.children[0].cells.length; i++) {
            headers.push(table.tHead.children[0].cells[i].innerText)
        }
        data.push(headers)
        for (var i = 1; i < table.rows.length; i++) {
            var tableRow = table.rows[i];
            var rowData = [];
            for (var j = 1; j < tableRow.cells.length; j++) {
                if (j === 6) {
                    //format Thành tiền
                    rowData.push(String(tableRow.cells[j].innerText).split(',')[0]);
                } else {
                    rowData.push(tableRow.cells[j].innerText);
                }
            }
            data.push(rowData);
        }
        return data;
    }


    // Listen for messages
    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
        // If the received message has the expected format...
        if (msg.text === 'report_back') {
            // Call the specified callback, passing
            // the web-page's DOM content as argument
            const extractedData = getHTMLTable();
            console.log(msg)
            console.log(sender)
            console.log(extractedData)
            sendResponse({ data: extractedData })
        }
        return true
    });


})();