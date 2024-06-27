import { EditOutlined } from '@ant-design/icons';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  Modal,
  Select,
  Table,
  TableProps,
  Typography,
  message,
} from 'antd';
import { useEffect, useState } from 'react';
import styles from './index.less';

interface IAddress {
  takeEffectTime: string;
  countryRegion: string;
  address1: string;
  address2: string;
}

const DemoPage: React.FC = () => {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressList, setAddressList] = useState<IAddress[]>([]);

  const tableColumns: TableProps<IAddress>['columns'] = [
    {
      title: 'Take Effect Time',
      dataIndex: 'takeEffectTime',
      key: 'takeEffectTime',
    },
    {
      title: 'Country/Region',
      dataIndex: 'countryRegion',
      key: 'countryRegion',
    },
    {
      title: 'Address1',
      dataIndex: 'address1',
      key: 'address1',
      render: (text) => text || '-',
    },
    {
      title: 'Address2',
      dataIndex: 'address2',
      key: 'address2',
      render: (text) => text || '-',
    },
  ];

  useEffect(() => {
    try {
      const list = localStorage.getItem('addressList');
      setAddressList(JSON.parse(list || '[]'));
    } catch {
      setAddressList([]);
    }
  }, []);

  useEffect(() => {
    if (addressList.length) {
      localStorage.setItem('addressList', JSON.stringify(addressList));
    }
  }, [addressList]);

  return (
    <div className={styles.container}>
      <Card>
        <div className={styles.header}>
          <Typography.Title level={4}>Home Address</Typography.Title>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Add
          </Button>
        </div>
        <div className={styles.body}>
          <Table rowKey="id" columns={tableColumns} dataSource={addressList} />
        </div>
      </Card>
      <Modal
        title="Add Address"
        width={800}
        open={isModalOpen}
        onOk={() => {
          setAddressList([
            ...addressList,
            {
              id: addressList.length + 1,
              ...(form.getFieldsValue() || {}),
              takeEffectTime: form
                .getFieldValue('takeEffectTime')
                ?.format('YYYY-MM-DD'),
            },
          ]);
          message.success('add address success');
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Form
          form={form}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 8 }}
          layout="horizontal"
        >
          <Form.Item
            label="Take Effect Time"
            name="takeEffectTime"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="Country/Region"
            name="countryRegion"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="United States">United States</Select.Option>
              <Select.Option value="China">China</Select.Option>
              <Select.Option value="Germany">Germany</Select.Option>
              <Select.Option value="India">India</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Address1" name="address1">
            <Input />
          </Form.Item>
          <Form.Item label="Address2" name="address2">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DemoPage;
