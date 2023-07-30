import moment from 'moment'

// YYYY-MM-DD HH:MM:SS
export const fromStringtoSqlTimestamp = (txt: string): string => 
  moment(txt).format('YYYY-MM-DD HH:mm:ss')

export const fromSqlTimestampToString = (txt: string): string =>
  moment(txt).format('YYYY-MM-DD')

export const timeAgo = (txt: string): string => moment(txt).fromNow()
