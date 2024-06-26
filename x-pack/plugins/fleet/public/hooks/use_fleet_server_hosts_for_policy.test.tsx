/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { renderHook } from '@testing-library/react-hooks';

import { useFleetServerHostsForPolicy } from './use_fleet_server_hosts_for_policy';
import { useGetFleetServerHosts } from './use_request/fleet_server_hosts';
import { useGetFleetProxies } from './use_request/fleet_proxies';
import { useGetDownloadSources } from './use_request/download_source';

jest.mock('./use_request/fleet_server_hosts');
jest.mock('./use_request/fleet_proxies');
jest.mock('./use_request/download_source');

describe('useFleetServerHostsForPolicy', () => {
  beforeEach(() => {
    jest.mocked(useGetFleetServerHosts).mockReturnValue({
      isLoading: false,
      isInitialRequest: false,
      data: {
        items: [
          {
            id: 'default',
            is_default: true,
            host_urls: ['https://defaultfleetserver:8220'],
            is_preconfigured: false,
            name: 'Default',
          },
          {
            id: 'custom1',
            is_default: false,
            host_urls: ['https://custom1:8220'],
            is_preconfigured: false,
            name: 'Custom 1',
          },
        ],
        page: 1,
        perPage: 100,
        total: 2,
      },
    } as any);
    jest.mocked(useGetFleetProxies).mockReturnValue({
      isInitialRequest: false,
      isLoading: false,
      data: {
        items: [],
      },
    } as any);
    jest.mocked(useGetDownloadSources).mockReturnValue({
      isInitialRequest: false,
      isLoading: false,
      data: {
        items: [
          {
            id: 'default',
            is_default: true,
          },
          {
            id: 'custom1',
          },
        ],
      },
    } as any);
  });
  it('should return default hosts if used without agent policy', () => {
    const { result } = renderHook(() => useFleetServerHostsForPolicy());
    expect(result.current.fleetServerHosts).toEqual(['https://defaultfleetserver:8220']);
  });

  it('should return default hosts if used with agent policy that do not override fleet server host', () => {
    const { result } = renderHook(() =>
      useFleetServerHostsForPolicy({
        id: 'testpolicy1',
      } as any)
    );
    expect(result.current.fleetServerHosts).toEqual(['https://defaultfleetserver:8220']);
  });

  it('should return custom hosts if used with agent policy that override fleet server hosts', () => {
    const { result } = renderHook(() =>
      useFleetServerHostsForPolicy({
        id: 'testpolicy1',
        fleet_server_host_id: 'custom1',
      } as any)
    );
    expect(result.current.fleetServerHosts).toEqual(['https://custom1:8220']);
  });

  it('should return default download source if used with a policy not overriding download source', () => {
    const { result } = renderHook(() =>
      useFleetServerHostsForPolicy({
        id: 'testpolicy1',
        fleet_server_host_id: 'custom1',
      } as any)
    );
    expect(result.current.downloadSource?.id).toEqual('default');
  });

  it('should return custom download source if used with a policy overriding download source', () => {
    const { result } = renderHook(() =>
      useFleetServerHostsForPolicy({
        id: 'testpolicy1',
        fleet_server_host_id: 'custom1',
        download_source_id: 'custom1',
      } as any)
    );
    expect(result.current.downloadSource?.id).toEqual('custom1');
  });
});
