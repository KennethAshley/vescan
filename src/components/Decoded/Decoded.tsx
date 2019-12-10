import React, { useEffect, useState, Fragment } from 'react';
import { abi } from 'thor-devkit/dist/abi';
import { isEmpty } from 'lodash';

import Address from '../Address';

const abiCache = new Map<string, any>();

async function queryABI(sig: string) {
  const url = `https://b32.vecha.in/q/${sig}.json`;
  const resp = await fetch(url);

  if (resp.status === 404) {
    return null;
  }

  if (resp.status !== 200) {
    throw new Error(`Failed to query ABI (status: ${resp.status})`);
  }

  const json = await resp.json();

  if (!Array.isArray(json) || !json[0]) {
    throw new Error('Failed to query ABI (bad response)');
  }
  return json[0];
}

type Value = {
  data: string;
  topics?: string[];
}

type DecodedProps = {
  value: Value;
}

type Decoded = {
  params: any[],
}

function Decoded({ value }: DecodedProps) {
  const [json, setJson] = useState(null as abi.Function.Definition | abi.Event.Definition | null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as Error | null);
  const [decoded, setDecoded] = useState(null as abi.Decoded | null);

  useEffect(() => {
    async function get() {
      if (loading) {
        return;
      }

      if (value.topics) {
        setJson(abiCache.get(value.topics[0]) || null);
      } else {
        setJson(abiCache.get(value.data.slice(0, 10)) || null);
      }

      try {
        const sig = value.topics ? value.topics[0] : value.data.slice(0, 10);
        setJson(await queryABI(sig));

        if (json) {
          abiCache.set(sig, json)
        }
      } catch(err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    get();
  }, [ json, loading, value ]);

  useEffect(() => {
    async function get() {
      if (!json) {
        return null;
      }

      if (json.type === 'event') {
        const ev = new abi.Event(json);
        const dec = ev.decode(value.data, value.topics!)

          return {
            params: json.inputs.map((p: any, i: any) => {
              return {
                name: p.name,
                type: p.type,
                value: dec[i],
                indexed: p.indexed,
              }
            }),
            canonicalName: ev.canonicalName
        }
      } else {
        const fn = new abi.Function(json)
        const dec = abi.decodeParameters(json.inputs, '0x' + value.data.slice(10))

        return {
          params: json.inputs.map((p: any, i: any) => {
            return {
              name: p.name,
              type: p.type,
              value: dec[i],
            }
          }),
          canonicalName: fn.canonicalName
        }
      }
    }

    if (isEmpty(decoded)) {
      get().then(data => {
        setDecoded(data);
      });
    }
  }, [ json, value, decoded ]);

  return (
    <div className="ant-table">
      <table>
        { decoded && decoded.params.length > 0 && (
          <Fragment>
            <thead className="ant-table-thead">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Type</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody className="ant-table-tbody">
              { decoded && decoded.params.map((param: any, index: number) => (
                <tr key={index} className="ant-table-row">
                  <td>{ index }</td>
                  <td>{ param.name }</td>
                  <td>
                    { param.type }
                    { param.indexed &&
                      <sup>indexed</sup>
                    }
                  </td>
                  <td>
                    { (param.type === 'address') ? (
                        <Address address={param.value} />
                      ) : (
                      <Fragment>
                        { param.value }
                      </Fragment>
                      )
                    }
                  </td>
                </tr>
              )) }
            </tbody>
          </Fragment>
        )}
      </table>
    </div>
  );
}

export default Decoded;
