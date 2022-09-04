console.log('This is the background page.');
console.log('Put the background scripts here.');
import { MESSAGE_EVENT } from '../../constants';



chrome.runtime.onMessage.addListener(async function (message, sender, reply) {
    switch (message.event) {
        case MESSAGE_EVENT.EXTRACT_MISA_DATA:
            let result =
                chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, { text: 'report_back' }, response => {
                        chrome.runtime.sendMessage({ event: MESSAGE_EVENT.RECEIVE_MISA_DATA, data: response }, function (res) {
                            console.log(MESSAGE_EVENT.RECEIVE_MISA_DATA)
                            return true
                        });
                    });
                });
            return null
        default:
            console.log("No event found")
            return null
    }
});