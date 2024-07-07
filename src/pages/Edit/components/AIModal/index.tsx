import { Divider, Input, Modal, Select } from 'antd';
import { useState } from 'react';
import { IAddress } from '../..';
import styles from './index.less';

interface IProps {
  open?: boolean;
  onOk?: () => void;
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
  const [isAISearching, setAISearching] = useState(false);
  const [aiSearchOptions, setAISearchOptions] = useState<IAddress[]>([]);

  const onAISearch = async () => {
    try {
      setAISearchOptions([]);
      setAISearching(true);
      const result = await mockAISearch();
      setAISearchOptions(result);
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
      onOk={onOk}
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
          />
        </div>
        <Divider>or</Divider>
        <div className={styles.addressAIPaste}>
          <Input.TextArea placeholder='Paste your address text here' rows={4} />
        </div>
      </>
    </Modal>
  );
};

export default AIModal;
