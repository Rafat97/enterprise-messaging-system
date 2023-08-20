import { REQUEST_ID_HEADER, REQUEST_LOG_HEADER_ID } from '@fanout/envs';
import { storage } from './store';
import { format } from 'winston';
import { FormatWrap } from 'logform';

export const customLogIdFormatter: FormatWrap = format((info) => {
  const req = storage.getStore()?.request || undefined;
  const reqId = req?.headers[REQUEST_ID_HEADER] || undefined;
  const logId = req?.headers[REQUEST_LOG_HEADER_ID] || undefined;
  if (reqId) {
    info.requestId = reqId;
  }
  info.logId = logId;
  info.requestInfo = JSON.stringify({ url: req?.url, method: req?.method });

  return info;
});
