import React from 'react';
import AriaTabPanel from 'react-aria-tabpanel';
import { noselectCSS } from 'app/styles';

export type Tab = {
    title: string
    id: string
    content: React.ReactNode
}

declare namespace Tabs {
    export interface Props {
        tabs: Array<Tab>
        defaultActive: string
    }
}

export default class Tabs extends React.Component<Tabs.Props> {
    state = { activeTab: this.props.defaultActive };

    setTab(tid: string) {
        this.setState({ activeTab: tid });
    }

    render() {
        const { activeTab } = this.state;
        const { tabs } = this.props;

        const tablist = tabs.map((tab, i) => {
            let innerCl = 'Tabs-tabInner';
            const isActive = tab.id === activeTab;
            if (isActive) innerCl += ' is-active';
            return (
                <li key={i} style={{
                    border: '1px solid #d9d9d9',
                    borderLeft: i > 0 ? 'none' : '1px solid #d9d9d9',
                    borderBottom: 'none'
                }}>
                    <AriaTabPanel.Tab
                        id={tab.id}
                        active={isActive}
                    >
                        <div className={innerCl} style={{
                            display: 'inline',
                            borderBottom: isActive ? '1px solid #fff' : 'none',
                            padding: '1px 0.5em',
                            backgroundColor: isActive ? '#fff' : 'transparent',
                            cursor: 'pointer'
                        }}>
                            {tab.title}
                        </div>
                    </AriaTabPanel.Tab>
                </li>
            );
        });

        const panels = tabs.map((tab, i) => {
            return (
                <AriaTabPanel.TabPanel
                    key={i}
                    tabId={tab.id}
                    active={tab.id === activeTab}
                >
                    {tab.content}
                </AriaTabPanel.TabPanel>
            );
        });

        return (
            <AriaTabPanel.Wrapper
                onChange={this.setTab.bind(this)}
                activeTabId={this.state.activeTab}
            >
                <AriaTabPanel.TabList>
                    <ul style={{
                        display: 'flex',
                        listStyleType: 'none',
                        padding: 0,
                        margin: 0,
                        borderBottom: '1px solid #d9d9d9',
                        ...noselectCSS,
                    }}>
                        {tablist}
                    </ul>
                </AriaTabPanel.TabList>
                <div style={{ backgroundColor: '#fff', border: '1px solid #d9d9d9', borderTop: 'none', padding: 5 }}>
                    {panels}
                </div>
            </AriaTabPanel.Wrapper>
        );
    }
}
