import {StyleSheet} from 'react-native';

import styled from 'styled-components/native';

import Button from '~/components/Button';
import {colors, fonts, metrics} from '~/styles';
import {heightPercentageToDP, widthDimension} from '~/utils/Layout';

export const Container = styled.SafeAreaView`
  flex: 1;
  flex-direction: column;
`;

export const Box = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingTop: 38,
    paddingBottom: 0,
  },
})`
  margin: 0px 20px;
  top: ${heightPercentageToDP('-13%')}px;
  min-height: ${heightPercentageToDP('75%')}px;
`;

export const CadProduct = styled.View`
  flex: 1;
  top: 0;
  top: ${heightPercentageToDP('-5%')}px;
  flex-direction: column;
  align-items: flex-start;
  background: ${colors.white_};
  border-radius: ${metrics.border_radius}px;
`;

export const ContainerProduct = styled.View`
  width: 100%;
  display: flex;

  border-width: ${StyleSheet.hairlineWidth}px;
  border-color: ${colors.twelve};
  border-radius: ${metrics.border_radius}px;

  padding-top: 10px;
  margin-bottom: 10px;
`;
export const ProductView = styled.View`
  top: -5px;
  padding: 0 10px 0 10px;
`;
export const DeliveryDetail = styled.View`
  padding: 0 10px 0 10px;
`;

export const Product = styled.View`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Label = styled.Text`
  margin-top: 10px;
  font-weight: bold;
  font-size: ${fonts.regular}px;
  color: ${colors.sixX};
`;

export const InfoAddress = styled.Text`
  margin-top: 4px;
  font-size: ${fonts.regular}px;
  color: ${colors.sixX};
  margin-bottom: 5px;
  font-weight: normal;
`;

export const InfoText = styled.Text`
  margin-top: 4px;
  font-size: ${fonts.regular}px;
  color: ${colors.sixX};
  margin-bottom: 5px;
  font-weight: normal;
  width: 90%;
`;

export const InfoTime = styled.Text`
  margin-top: 4px;
  font-size: ${fonts.regular}px;
  color: ${colors.sixX};
  margin-bottom: 5px;
  font-weight: normal;
  width: 90%;

  letter-spacing: 2.8px;
`;

export const HeaderDelivery = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const TitleStatus = styled.Text`
  margin-top: 4px;
  font-size: ${fonts.regular}px;
  color: ${colors.third};
  font-weight: bold;
  margin-left: 8px;
`;

export const ContainerTime = styled.View`
  display: flex;
  flex-direction: ${widthDimension < 370 ? 'column' : 'row'};
  align-items: ${widthDimension < 370 ? 'flex-start' : 'center'};
  justify-content: space-between;
  padding-bottom: 10px;
`;

export const Date = styled.View`
  display: flex;
  flex-direction: column;
`;

export const Withdrawal = styled(Button)`
  align-self: stretch;
  margin-top: 20px;
  background: #5cce1a;
`;
