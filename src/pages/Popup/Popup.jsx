import React, { useState } from 'react';
import { MESSAGE_EVENT } from '../../constants';
import './Popup.css';

const PRODUCT_ID_INDEX = 1
const PRODUCT_NAME_INDEX = 2
const PRODUCT_UNIT_INDEX = 3
const IMPORT_WAREHOUSE_INDEX = 4
const PRICE_PER_UNIT_INDEX = 5
const TAX_PERCENTAGE_INDEX = 7
const DISCOUNT_RATE_INDEX = 8
const PRODUCT_ORDER_PRICE = 9


const Popup = () => {
  const [texts, setText] = useState([])

  const onCopy = (event) => {
    chrome.runtime.sendMessage({ event: MESSAGE_EVENT.EXTRACT_MISA_DATA }, function (response) {
      console.log(response)
      return true

    });
  }

  chrome.runtime.onMessage.addListener(async function (message, sender, reply) {
    console.log(message)

    const { jsonTable, totalMoney, purchaseId, purchaserName, providerName } = message.data.data
    const dataRows = ['', '']
    jsonTable.forEach((data, index) => {
      if (index !== 0 && index < jsonTable.length - 1) {
        dataRows[0] = dataRows[0] + `${purchaseId.replace('Đơn mua hàng ĐMH0', '')};${'""'};${'""'};${'""'};${'""'};${'""'};${providerName};${data[PRODUCT_NAME_INDEX]};${data[PRODUCT_ID_INDEX]};${data[PRODUCT_UNIT_INDEX]}${index === jsonTable.length - 2 ? '' : '\n'}`
        dataRows[1] = dataRows[1] + `${data[IMPORT_WAREHOUSE_INDEX]};${data[PRICE_PER_UNIT_INDEX]};${'""'};${data[TAX_PERCENTAGE_INDEX] || 0}%;${data[DISCOUNT_RATE_INDEX].split(',')[0]}%;${data[PRODUCT_ORDER_PRICE]};${totalMoney}${index === jsonTable.length - 2 ? '' : '\n'}`
      }
    })
    setText(dataRows)
    return true
  })

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={onCopy}>
          Copy thông tin hàng tiền
        </button>
        <div style={{ 'overflow-y': "scroll" }}>
          {
            texts?.length ? texts.map(text => {
              return (
                <textarea style={{ 'width': '100%', 'height': '4rem' }} value={text}></textarea>
              )
            }) : <a>Thông tin copy sẽ hiển thị ở đây</a>
          }
        </div>
      </header>
    </div>
  );
};



export default Popup;
