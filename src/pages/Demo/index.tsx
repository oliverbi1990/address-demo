import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  Divider,
  List,
  Modal,
  Space,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import AddressForm from './components/AddressForm';
import styles from './index.less';

export interface IAddress {
  type?: string;
  country?: string;
  state?: string;
  city?: string;
  address1: string;
  address2?: string;
  zipCode?: string;
  alternateList?: IAddress[];
}

const Demo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressList, setAddressList] = useState<IAddress[]>([]);

  useEffect(() => {
    try {
      const list = localStorage.getItem('addressList');
      setAddressList(JSON.parse(list || '[]'));
    } catch {
      setAddressList([]);
    }
  }, []);

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <Typography.Title level={4}>Address List</Typography.Title>
          <Button
            type='primary'
            icon={<EditOutlined />}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
        </div>
        <div className={styles.body}>
          <List
            header={null}
            footer={null}
            bordered
            dataSource={addressList}
            renderItem={({
              country,
              state,
              city,
              address1,
              address2,
              zipCode,
            }) => (
              <List.Item>{`${address1 || '-'}${
                address2 ? `(${address2})` : ''
              }, ${city || '-'}, ${state || '-'}, ${country || '-'}${
                zipCode ? ` ${zipCode}` : ''
              }`}</List.Item>
            )}
          />
        </div>
      </Card>
      <Modal
        title={
          <div className={styles.modalTitle}>
            <Space>
              <Typography.Title level={4}>Edit Address</Typography.Title>
              <Tooltip title='Add Address'>
                <Button
                  size='small'
                  shape='circle'
                  icon={<PlusOutlined />}
                  onClick={() => {
                    setAddressList([
                      ...addressList,
                      {
                        type: '',
                        country: '',
                        city: '',
                        state: '',
                        address1: '',
                        address2: '',
                        zipCode: '',
                        alternateList: [
                          {
                            city: '',
                            state: '',
                            address1: '',
                            address2: '',
                            zipCode: '',
                          },
                          {
                            city: '',
                            state: '',
                            address1: '',
                            address2: '',
                            zipCode: '',
                          },
                        ],
                      },
                    ]);
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        }
        width={800}
        open={isModalOpen}
        onOk={() => {
          message.success('Success');
          setIsModalOpen(false);
          localStorage.setItem('addressList', JSON.stringify(addressList));
        }}
        onCancel={() => {
          setIsModalOpen(false);
          const list = localStorage.getItem('addressList');
          setAddressList(JSON.parse(list || '[]'));
        }}
      >
        {addressList.map((addressItem, index) => {
          return (
            <div key={index}>
              <AddressForm
                data={addressItem}
                onChange={values => {
                  addressList[index] = values;
                  setAddressList([...addressList]);
                }}
                onDelete={() => {
                  addressList.splice(index, 1);
                  setAddressList([...addressList]);
                }}
              />
              {index !== addressList.length - 1 ? <Divider /> : null}
            </div>
          );
        })}
      </Modal>
    </div>
  );
};

export default Demo;
