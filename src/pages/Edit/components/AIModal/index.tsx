import { Descriptions, Divider, Input, Modal, Select } from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useState } from 'react';
import { IAddress } from '../..';
import styles from './index.less';

interface IProps {
  open?: boolean;
  onOk?: (address: IAddress) => void;
  onCancel?: () => void;
}

const mockAISearch: () => Promise<IAddress[]> = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          country: 'China',
          state: 'Beijing',
          city: 'Beijing',
          address1:
            'Floor 10, Building 3, World Profit Center No. 16, Tianze Road, Chaoyang District ',
        },
        {
          country: 'China',
          state: 'Shanghai',
          city: 'Shanghai',
          address1:
            'No.1000 &1001, Chenhui Road Zhangjiang High-Tech. Park, Pudong New District ',
        },
      ]);
    }, 1000);
  });
};

const AIModal: React.FC<IProps> = ({ open, onOk, onCancel }) => {
  const [currentAddress, setCurrentAddress] = useState<IAddress>();
  const [isAISearching, setAISearching] = useState(false);
  const [aiSearchOptions, setAISearchOptions] = useState<
    IAddress & DefaultOptionType[]
  >([]);

  const onAISearch = async () => {
    try {
      setAISearchOptions([]);
      setAISearching(true);
      const result = await mockAISearch();
      setAISearchOptions(
        result.map((item, index) => ({
          ...item,
          label: index,
          value: index,
        }))
      );
    } catch {
      setAISearchOptions([]);
    } finally {
      setAISearching(false);
    }
  };

  const renderAddress = (addressItem: IAddress) => {
    const { address1, address2, city, state, country, zipCode } =
      addressItem || {};
    return (
      <>
        <div className={styles.searchAddressTitle}>{`${city || '-'}, ${
          state || '-'
        }, ${country || '-'}`}</div>
        <div className={styles.searchAddressDetail}>{`${
          zipCode ? `${zipCode} ` : ''
        }${address1 || '-'}${address2 ? `(${address2})` : ''}`}</div>
      </>
    );
  };

  return (
    <Modal
      wrapClassName={styles.addressAIModal}
      title={'Spotlight'}
      open={open}
      okText={'Apply'}
      okButtonProps={{
        disabled: !currentAddress,
      }}
      onOk={() => {
        if (currentAddress) onOk?.(currentAddress);
      }}
      onCancel={onCancel}
    >
      <>
        <div className={styles.addressAISearch}>
          <Select
            popupClassName={styles.addressAISearchPopup}
            labelInValue
            autoFocus={true}
            placeholder='Type and Search'
            filterOption={false}
            showSearch={true}
            onSearch={onAISearch}
            options={aiSearchOptions}
            style={{ width: '100%' }}
            loading={isAISearching}
            optionRender={(option) => renderAddress(option.data as IAddress)}
            onSelect={(_value, option) => {
              setCurrentAddress(option as IAddress);
            }}
          />
        </div>
        <Divider>or</Divider>
        <div className={styles.addressAIPaste}>
          <Input.TextArea placeholder='Paste your address text here' rows={4} />
        </div>
        {currentAddress ? (
          <div className={styles.addressAIResult}>
            <Descriptions title={<div className={styles.title}>Address Info</div>}>
              <Descriptions.Item label='Country/Region'>
                {currentAddress?.country || '-'}
              </Descriptions.Item>
              <Descriptions.Item label='State'>
                {currentAddress?.state || '-'}
              </Descriptions.Item>
              <Descriptions.Item label='City'>
                {currentAddress?.city || '-'}
              </Descriptions.Item>
              <Descriptions.Item label='Address'>
                {currentAddress?.address1 || '-'}
              </Descriptions.Item>
            </Descriptions>
          </div>
        ) : null}
      </>
    </Modal>
  );
};

export default AIModal;
