import { SketchOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Empty,
  Input,
  Modal,
  Row,
  Select,
} from 'antd';
import { DefaultOptionType } from 'antd/es/select';
import { useEffect, useState } from 'react';
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
          state: 'Shanghai',
          city: 'Shanghai',
          address1: '1001 Chenhui Road, Pudong District',
        },
        {
          country: 'China',
          state: 'Zhejiang',
          city: 'Hangzhou',
          address1: '1001 Chenhui Road, Xiaoshan District',
        },
        {
          country: 'China',
          state: 'Zhejiang',
          city: 'Ningbo',
          address1: '1001 Chenhui Road, Yinzhou District',
        },
        {
          country: 'China',
          state: 'Sichuan',
          city: 'Chengdu',
          address1: '1001 Chenhui Road, Jingjiang District',
        },
      ]);
    }, 1000);
  });
};

const AIModal: React.FC<IProps> = ({ open, onOk, onCancel }) => {
  const [currentAddress, setCurrentAddress] = useState<IAddress | null>();
  const [isAISearching, setAISearching] = useState(false);
  const [aiSearchOptions, setAISearchOptions] = useState<
    IAddress & DefaultOptionType[]
  >([]);
  const [isAIGenerating, setAIGenerating] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');

  useEffect(() => {
    if (!open) {
      setCurrentAddress(null);
    }
  }, [open]);

  const onAISearch = async () => {
    try {
      setAISearchOptions([]);
      setAISearching(true);
      const result = await mockAISearch();
      setAISearchOptions(
        result.map((item, index) => ({
          ...item,
          label: item.address1,
          value: index,
        }))
      );
    } catch {
      setAISearchOptions([]);
    } finally {
      setAISearching(false);
    }
  };

  const onAIGenerate = () => {
    setAIGenerating(true);
    setTimeout(() => {
      // Search address and Translate into Chinese
      if (currentAddress && aiPrompt === 'Translate into Chinese') {
        if (!currentAddress.alternateList) currentAddress.alternateList = [];
        currentAddress.alternateList.push({
          country: '中国',
          state: '上海',
          city: '上海',
          address1: '浦东新区晨晖路1001号',
          zipCode: '',
        });
      }

      // Search address and Translate into Chinese And German
      if (currentAddress && aiPrompt === 'Translate into Chinese And German') {
        if (!currentAddress.alternateList) currentAddress.alternateList = [];
        currentAddress.alternateList = [
          {
            country: '中国',
            state: '上海',
            city: '上海',
            address1: '浦东新区晨晖路1001号',
            zipCode: '',
          },
          {
            country: 'China',
            state: 'Shanghai',
            city: 'Shanghai',
            address1: 'Nr. 1001, Chenhui Straße, Pudong Bezirk',
            zipCode: '',
          },
        ];
      }

      // Recognize address
      if (
        aiPrompt === `1001 Chenhui Road, Pudong District Shanghai China 201203`
      ) {
        setCurrentAddress({
          country: 'China',
          state: 'Shanghai',
          city: 'Shanghai',
          address1: '1001 Chenhui Road, Pudong District',
          zipCode: '201203',
        });
      }

      // Recognize address and Translate into Chinese And German
      if (
        aiPrompt ===
        `1001 Chenhui Road, Pudong District Shanghai China 201203
Translate into Chinese And German`
      ) {
        setCurrentAddress({
          country: 'China',
          state: 'Shanghai',
          city: 'Shanghai',
          address1: '1001 Chenhui Road, Pudong District',
          zipCode: '201203',
          alternateList: [
            {
              country: '中国',
              state: '上海',
              city: '上海',
              address1: '浦东新区晨晖路1001号',
              zipCode: '201203',
            },
            {
              country: 'China',
              state: 'Shanghai',
              city: 'Shanghai',
              address1: 'Nr. 1001, Chenhui Straße, Pudong Bezirk',
              zipCode: '201203',
            },
          ],
        });
      }

      setAIGenerating(false);
    }, 3000);
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
      title={'AI Address AutoFill'}
      width={1000}
      open={open}
      okText={'Apply'}
      okButtonProps={{
        disabled: !currentAddress,
      }}
      onOk={() => {
        if (currentAddress) onOk?.(currentAddress);
      }}
      onCancel={onCancel}
      destroyOnClose
    >
      <>
        <Divider></Divider>
        <div className={styles.addressAIBody}>
          <Row gutter={24}>
            <Col span={14}>
              <div className={styles.addressAISearch}>
                <Select
                  popupClassName={styles.addressAISearchPopup}
                  labelInValue
                  autoFocus={true}
                  placeholder='Search Address'
                  filterOption={false}
                  showSearch={true}
                  onSearch={onAISearch}
                  options={aiSearchOptions}
                  style={{ width: '100%' }}
                  loading={isAISearching}
                  optionRender={(option) =>
                    renderAddress(option.data as IAddress)
                  }
                  onSelect={(_value, option) => {
                    setCurrentAddress(option as IAddress);
                  }}
                />
              </div>
              {currentAddress ? (
                <div className={styles.addressAIResult}>
                  <Descriptions
                    title={<div className={styles.title}>Address Info</div>}
                  >
                    <Descriptions.Item label='Country/Region'>
                      {currentAddress?.country || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label='State'>
                      {currentAddress?.state || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label='City'>
                      {currentAddress?.city || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label='Address 1'>
                      {currentAddress?.address1 || '-'}
                    </Descriptions.Item>
                    <Descriptions.Item label='Zip Code'>
                      {currentAddress?.zipCode || '-'}
                    </Descriptions.Item>
                  </Descriptions>
                  <div className={styles.alternateList}>
                    {currentAddress?.alternateList?.[0] ? (
                      <Descriptions
                        title={
                          <div className={styles.title}>
                            Alternative Language 1
                          </div>
                        }
                      >
                        <Descriptions.Item label='Country/Region'>
                          {currentAddress?.alternateList?.[0]?.country || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label='State'>
                          {currentAddress?.alternateList?.[0]?.state || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label='City'>
                          {currentAddress?.alternateList?.[0]?.city || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item span={2} label='Address 1'>
                          {currentAddress?.alternateList?.[0]?.address1 || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label='Zip Code'>
                          {currentAddress?.alternateList?.[0]?.zipCode || '-'}
                        </Descriptions.Item>
                      </Descriptions>
                    ) : null}
                    {currentAddress?.alternateList?.[1] ? (
                      <Descriptions
                        title={
                          <div className={styles.title}>
                            Alternative Language 2
                          </div>
                        }
                      >
                        <Descriptions.Item label='Country/Region'>
                          {currentAddress?.alternateList?.[1]?.country || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label='State'>
                          {currentAddress?.alternateList?.[1]?.state || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label='City'>
                          {currentAddress?.alternateList?.[1]?.city || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item span={2} label='Address 1'>
                          {currentAddress?.alternateList?.[1]?.address1 || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label='Zip Code'>
                          {currentAddress?.alternateList?.[1]?.zipCode || '-'}
                        </Descriptions.Item>
                      </Descriptions>
                    ) : null}
                  </div>
                </div>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </Col>
            <Col span={10}>
              <div className={styles.addressAIInput}>
                <Input.TextArea
                  placeholder='Enter your requirements'
                  rows={8}
                  onChange={(event) => {
                    setAIPrompt(event.target.value);
                  }}
                />
                <Button
                  className={styles.addressAIBtn}
                  type='primary'
                  icon={<SketchOutlined />}
                  size='small'
                  onClick={onAIGenerate}
                  disabled={!aiPrompt}
                >
                  Generate
                </Button>
              </div>
            </Col>
          </Row>
          {isAIGenerating ? (
            <div className={styles.addressAILoading}>
              <div className={styles.loadingWrapper}>
                <img className={styles.loadingGif} src='/loading.gif' />
              </div>
            </div>
          ) : null}
        </div>
        <Divider></Divider>
      </>
    </Modal>
  );
};

export default AIModal;
