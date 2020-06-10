import styled from 'styled-components';

import {colors} from '~/styles';
import {heightPercentageToDP, widthPercentageToDP} from '~/utils/Layout';

export const ModalBackground = styled.View`
  flex: 1;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  background: #00000050;
`;

export const ActivityIndicatorWrapper = styled.View`
  color: #fff;
  height: ${heightPercentageToDP('25%')}px;
  width: ${widthPercentageToDP('95%')}px;
  padding: 0 ${widthPercentageToDP('5%')}px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

export const Name = styled.Text`
  font-weight: bold;
  font-size: 14px;
  color: ${colors.white_};
`;
