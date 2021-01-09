import React from 'react';
import Redirect from 'umi/redirect';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);

export default ({ children }) => (
  <Authorized>
    { children}
  </Authorized>
);
