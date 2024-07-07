import { DeleteOutlined, OpenAIOutlined } from '@ant-design/icons';
import { Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import AIModal from './components/AIModal';
import AddressForm from './components/AddressForm';
import styles from './index.less';

export interface IAddress {
  type?: string;
  country?: string;
  state?: string;
  city?: string;
  address1?: string;
  address2?: string;
  zipCode?: string;
  alternateList?: IAddress[];
}

const createAddress = () => {
  return {
    type: '',
    country: '',
    state: '',
    city: '',
    address1: '',
    address2: '',
    zipCode: '',
    alternateList: [
      {
        state: '',
        city: '',
        address1: '',
        address2: '',
        zipCode: '',
      },
      {
        state: '',
        city: '',
        address1: '',
        address2: '',
        zipCode: '',
      },
    ],
  };
};

const Edit: React.FC = () => {
  const [addressList, setAddressList] = useState<IAddress[]>([]);
  const [currentAddress, setCurrentAddress] = useState<IAddress>();
  const [isAIModalOpen, setAIModalOpen] = useState(false);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('addressList') || '[]');
      if (!list.length) {
        setAddressList([createAddress()]);
      } else {
        setAddressList(list);
      }
    } catch {
      setAddressList([]);
    }
  }, []);

  const onSave = () => {
    localStorage.setItem('addressList', JSON.stringify(addressList));
    history.back();
  };

  return (
    <div className={styles.container}>
      <div
        className={styles.addBtn}
        onClick={() => {
          setAddressList([...addressList, createAddress()]);
        }}
      >
        Add
      </div>
      <div className={styles.body}>
        {addressList.map((addressItem, index) => (
          <div key={index} className={styles.addressItem}>
            <div className={styles.option}>
              <Button
                icon={<OpenAIOutlined />}
                type='text'
                onClick={() => {
                  setCurrentAddress(addressItem);
                  setAIModalOpen(true);
                }}
              >
                Spotlight
              </Button>
              <Button
                icon={<DeleteOutlined />}
                type='text'
                onClick={() => {
                  addressList.splice(index, 1);
                  setAddressList([...addressList]);
                }}
              >
                Delete
              </Button>
            </div>
            <div className={styles.card}>
              <AddressForm
                data={addressItem}
                onChange={(addressItem) => {
                  addressList[index] = addressItem;
                  setAddressList([...addressList]);
                }}
              />
            </div>
          </div>
        ))}
        <div className={styles.addressConfirm}>
          <Space>
            <Button
              type='primary'
              onClick={() => {
                onSave();
              }}
            >
              Save
            </Button>
            <Button
              type='text'
              onClick={() => {
                history.back();
              }}
            >
              Cancel
            </Button>
          </Space>
        </div>
      </div>
      <AIModal
        open={isAIModalOpen}
        onOk={(address) => {
          const index = addressList.findIndex(
            (item) => item === currentAddress
          );
          if (index !== -1) {
            addressList[index] = {
              ...(addressList[index] || {}),
              ...(address || {}),
            };
          }
          setAIModalOpen(false);
        }}
        onCancel={() => {
          setAIModalOpen(false);
        }}
      ></AIModal>
    </div>
  );
};

export default Edit;
