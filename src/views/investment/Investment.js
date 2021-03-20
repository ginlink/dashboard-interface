import "./investment.css"

import { Collapse , Button } from 'antd';

const { Panel } = Collapse;

function callback(key) {
  console.log(key);
}

const text = (
    <table>
        <tr>
            <td>reward pool地址：</td>
            <td></td>
        </tr>
        <tr>
            <td>策略地址：</td>
            <td></td>
        </tr>
        <tr>
            <td>代币地址</td>
            <td></td>
        </tr>
        <tr>
            <td>金库地址</td>
            <td></td>
        </tr>
        <tr>
            <td>金库owner</td>
            <td></td>
        </tr>
        <tr>
            <td>策略opwner</td>
            <td></td>
        </tr>
    </table>
)

const Investment = () => {
    return(
        <div>
            <div className="investment-header">
                <div className="investment-header-wrap">
                    <span className="investment-header-left">名称</span>
                    <spna className="investment-header-right">收益代币</spna>
                </div>
            </div>
            <Collapse defaultActiveKey={['1']} onChange={callback}>
                <Panel header={
                    <div className="investment-table-header">
                        <div>
                            <span className="tokenName">MDX-USTD</span>
                            <spna >con</spna>
                        </div>
                        <div className="investment-table-header-right">
                            <Button>EARN</Button>
                            <Button>HARVEST</Button>
                            <button>⬇️</button>
                        </div>
                    </div>
                } key="1">
                <p>{text}</p>
                </Panel>
            </Collapse>
        </div>
    )
}

export default Investment