import { Col, Form, Input, Row, Select } from 'antd';
import { useEffect } from 'react';
import { IAddress } from '../..';
import styles from './index.less';

interface IProps {
  data?: IAddress;
  onChange?: (values: any) => void;
}

const AddressForm: React.FC<IProps> = ({ data, onChange }) => {
  const [form] = Form.useForm();
  const [alernativeForm1] = Form.useForm();
  const [alernativeForm2] = Form.useForm();

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      alernativeForm1.setFieldsValue(data?.alternateList?.[0] || {});
      alernativeForm2.setFieldsValue(data?.alternateList?.[1] || {});
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <Row gutter={64}>
        <Col span={8}>
          <Form
            form={form}
            layout='vertical'
            onValuesChange={(_changedValues, allValues) => {
              onChange?.({
                ...(data || {}),
                ...(allValues || {}),
              });
            }}
          >
            <Form.Item
              label='Address Type'
              name='type'
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value='Home'>Home</Select.Option>
                <Select.Option value='Business'>Business</Select.Option>
                <Select.Option value='Other'>Other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label='Country/Region'
              name='country'
              rules={[{ required: true }]}
            >
              <Select>
                <Select.Option value='United States'>
                  United States
                </Select.Option>
                <Select.Option value='China'>China</Select.Option>
                <Select.Option value='Germany'>Germany</Select.Option>
                <Select.Option value='India'>India</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label='State' name='state' rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label='City' name='city' rules={[{ required: true }]}>
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
          </Form>
        </Col>
        <Col span={8}>
          <Form
            form={alernativeForm1}
            layout='vertical'
            onValuesChange={(_changedValues, allValues) => {
              onChange?.({
                ...(data || {}),
                alternateList: [
                  { ...allValues },
                  data?.alternateList?.[1],
                ].filter((v) => v),
              });
            }}
          >
            <div className={styles.formSubTitle}>Alternative Language 1</div>
            <Form.Item label='Country/Region' name='country'>
              <Input />
            </Form.Item>
            <Form.Item label='State' name='state'>
              <Input />
            </Form.Item>
            <Form.Item label='City' name='city'>
              <Input />
            </Form.Item>
            <Form.Item label='Address 1' name='address1'>
              <Input />
            </Form.Item>
            <Form.Item label='Address 2(Optional)' name='address2'>
              <Input />
            </Form.Item>
            <Form.Item label='Zip Code' name='zipCode'>
              <Input />
            </Form.Item>
          </Form>
        </Col>
        <Col span={8}>
          <Form
            form={alernativeForm2}
            layout='vertical'
            onValuesChange={(_changedValues, allValues) => {
              onChange?.({
                ...(data || {}),
                alternateList: [
                  data?.alternateList?.[0],
                  { ...allValues },
                ].filter((v) => v),
              });
            }}
          >
            <div className={styles.formSubTitle}>Alternative Language 2</div>
            <Form.Item label='Country/Region' name='country'>
              <Input />
            </Form.Item>
            <Form.Item label='State' name='state'>
              <Input />
            </Form.Item>
            <Form.Item label='City' name='city'>
              <Input />
            </Form.Item>
            <Form.Item label='Address 1' name='address1'>
              <Input />
            </Form.Item>
            <Form.Item label='Address 2(Optional)' name='address2'>
              <Input />
            </Form.Item>
            <Form.Item label='Zip Code' name='zipCode'>
              <Input />
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default AddressForm;
