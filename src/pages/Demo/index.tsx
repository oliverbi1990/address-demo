import { EnvironmentOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { List } from 'antd';
import cls from 'classnames';
import { useEffect, useState } from 'react';
import { IAddress } from '../Edit';
import styles from './index.less';

const Demo: React.FC = () => {
  const [addressList, setAddressList] = useState<IAddress[]>([]);

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
    return `${zipCode ? `${zipCode} ` : ''}${address1 || '-'}${address2 ? `(${address2})` : ''}, ${
      city || '-'
    }, ${state || '-'}, ${country || '-'}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div
          className={styles.editBtn}
          onClick={() => {
            history.push('/edit');
          }}
        ></div>
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
