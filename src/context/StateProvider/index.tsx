import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
  useReducer,
} from 'react';
// import bcrypt from 'bcrypt';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getQuery, getPrice, postQuery } from '../../apis/api';
import { useNavigate } from 'react-router-dom';
import { AuthState } from '~/constants';
import reducer from './Reducers';

interface AuthContextType {
  state: any;
  dispatch: any;
}

const initialState = {
  balance_states: {
    isUSD: true,
  },
};

const StateContext = createContext<AuthContextType>({} as AuthContextType);

export const useStateContext = () => useContext(StateContext);

export const StateProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <StateContext.Provider value={{ state, dispatch }}>{children}</StateContext.Provider>;
};
