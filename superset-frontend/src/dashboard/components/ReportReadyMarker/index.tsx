/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { useSelector } from 'react-redux';
import { RootState } from 'src/dashboard/types';

/**
 * Chart statuses that count as terminal for report readiness: the chart has
 * either finished rendering or failed with a visible error state. A failed
 * chart is intentionally treated as ready so the error remains visible in the
 * printed report rather than blocking generation indefinitely.
 */
const TERMINAL_CHART_STATUSES = new Set(['rendered', 'failed', 'stopped']);

export const REPORT_READY_MARKER_CLASS = 'report-ready-marker';

/**
 * Renders an empty DOM marker (``.report-ready-marker``) once the print-ready
 * dashboard is ready to be printed by the reporting worker: the dashboard is
 * displayed and every chart has reached a terminal state (loaded or failed).
 *
 * This is the frontend side of the internal browser-print readiness contract
 * consumed by ``WebDriverPlaywright.get_pdf``. It is not a public API.
 */
export default function ReportReadyMarker() {
  const charts = useSelector((state: RootState) => state.charts);
  const isReady = Object.values(charts ?? {}).every(chart =>
    TERMINAL_CHART_STATUSES.has(chart.chartStatus ?? ''),
  );

  if (!isReady) {
    return null;
  }

  return (
    <div
      className={REPORT_READY_MARKER_CLASS}
      data-test={REPORT_READY_MARKER_CLASS}
      aria-hidden
      style={{ display: 'none' }}
    />
  );
}
