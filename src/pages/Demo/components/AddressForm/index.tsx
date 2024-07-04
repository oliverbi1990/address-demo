import { DeleteOutlined } from '@ant-design/icons';
import {
  Button,
  Collapse,
  CollapseProps,
  Form,
  FormListFieldData,
  Input,
  Select,
} from 'antd';
import { useEffect } from 'react';
import { IAddress } from '../..';
import styles from './index.less';

interface IProps {
  data?: IAddress;
  onChange?: (values: any) => void;
  onDelete?: () => void;
}

const AddressForm: React.FC<IProps> = ({ data, onChange, onDelete }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
  }, [data]);

  const renderAlternateList = (fields: FormListFieldData[]) => {
    const items: CollapseProps['items'] = fields.map((field, index) => {
      return {
        key: index,
        label: `Address in Alernative Language ${index + 1}`,
        children: (
          <>
            <Form.Item
              label='State'
              name={[field.name, 'state']}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='City'
              name={[field.name, 'city']}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Address 1'
              name={[field.name, 'address1']}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Address 2(Optional)'
              name={[field.name, 'address2']}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label='Zip Code'
              name={[field.name, 'zipCode']}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </>
        ),
      };
    });

    return <Collapse ghost items={items} />;
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <Form
          form={form}
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 7 }}
          layout='horizontal'
          onValuesChange={(_changedValues, allValues) => {
            onChange?.(allValues);
          }}
        >
          <Form.Item
            label='Address Type'
            name='type'
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value='Home'>Home</Select.Option>
              <Select.Option value='Mailing'>Mailing</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='Country/Region'
            name='country'
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value='United States'>United States</Select.Option>
              <Select.Option value='China'>China</Select.Option>
              <Select.Option value='Germany'>Germany</Select.Option>
              <Select.Option value='India'>India</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label='State'
            name='state'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='City'
            name='city'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Address 1'
            name='address1'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label='Address 2(Optional)' name='address2'>
            <Input />
          </Form.Item>
          <Form.Item
            label='Zip Code'
            name='zipCode'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.List name='alternateList'>
            {fields => renderAlternateList(fields)}
          </Form.List>
        </Form>
      </div>
      <div className={styles.option}>
        <Button
          type='dashed'
          icon={<DeleteOutlined />}
          onClick={() => {
            onDelete?.();
          }}
        />
      </div>
    </div>
  );
};

export default AddressForm;
