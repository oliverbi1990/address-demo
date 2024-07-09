import { EnvironmentOutlined, EyeOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Descriptions, Dropdown, List } from 'antd';
import cls from 'classnames';
import { useEffect, useState } from 'react';
import { IAddress } from '../Edit';
import styles from './index.less';

const Demo: React.FC = () => {
  const [addressList, setAddressList] = useState<IAddress[]>([]);
  const [addressFormat, setAddressFormat] = useState('Summary');

  useEffect(() => {
    try {
      const list = localStorage.getItem('addressList');
      setAddressList(JSON.parse(list || '[]'));
    } catch {
      setAddressList([]);
    }
  }, []);

  const renderAddressDetail = (addressItem: IAddress) => {
    const { address1, address2, city, state, country, zipCode } =
      addressItem || {};

    if (addressFormat === 'Summary') {
      return `${city || '-'}, ${state || '-'}, ${country || '-'}`;
    }

    if (addressFormat === 'Detail') {
      return `${zipCode ? `${zipCode} ` : ''}${address1 || '-'}${
        address2 ? `(${address2})` : ''
      }, ${city || '-'}, ${state || '-'}, ${country || '-'}`;
    }

    if (addressFormat === 'Full') {
      return (
        <Descriptions title={null}>
          <Descriptions.Item span={3} label='Country/Region'>
            {country || '-'}
          </Descriptions.Item>
          <Descriptions.Item span={1} label='State'>
            {state || '-'}
          </Descriptions.Item>
          <Descriptions.Item span={2} label='City'>
            {city || '-'}
          </Descriptions.Item>
          <Descriptions.Item span={3} label='Address 1'>
            {address1 || '-'}
          </Descriptions.Item>
          {address2 ? (
            <Descriptions.Item span={3} label='Address 2'>
              {address2 || '-'}
            </Descriptions.Item>
          ) : null}
          <Descriptions.Item span={3} label='Zip Code'>
            {zipCode || '-'}
          </Descriptions.Item>
        </Descriptions>
      );
    }

    return null;
  };

  const addressFormatList = [
    {
      key: 'Summary',
      label: <div onClick={() => setAddressFormat('Summary')}>Summary</div>,
    },
    {
      key: 'Detail',
      label: <div onClick={() => setAddressFormat('Detail')}>Detail</div>,
    },
    {
      key: 'Full',
      label: <div onClick={() => setAddressFormat('Full')}>Full</div>,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div
          className={styles.editBtn}
          onClick={() => {
            history.push('/edit');
          }}
        ></div>
        <div className={styles.viewBtn}>
          <Dropdown menu={{ items: addressFormatList }}>
            <a onClick={(e) => e.preventDefault()}>
              <EyeOutlined style={{ color: '#2a62d1', fontSize: '18px' }} />
            </a>
          </Dropdown>
        </div>
        <div className={styles.addressList}>
          <List
            itemLayout='horizontal'
            dataSource={addressList}
            renderItem={(addressItem) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <div
                      className={cls(
                        styles.addressIcon,
                        styles[addressItem.type || '']
                      )}
                    >
                      <EnvironmentOutlined />
                    </div>
                  }
                  title={addressItem.type}
                  description={
                    <div className={styles.addressDetail}>
                      {renderAddressDetail(addressItem)}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Demo;
