import request from '@/utils/axios'

// 登录
export function tmdbSearch(data: { keyword: string }): Promise<any> {
  return request({
    method: 'GET',
    url: '/search',
    params: data,
  })
}

export function createTorrent(data: any): Promise<any> {
  console.log('[ data ]-13-「api/file.ts」', data)
  return request({
    method: 'POST',
    url: '/create-torrent',
    data: data,
  })
}
