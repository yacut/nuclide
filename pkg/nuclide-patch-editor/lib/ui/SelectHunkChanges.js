/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import type {ExtraFileChangesData, HunkData} from '../types';
import type {HunkProps} from '../../../nuclide-ui/FileChanges';

import {Checkbox} from '../../../nuclide-ui/Checkbox';
import {HunkDiff} from '../../../nuclide-ui/FileChanges';
import nullthrows from 'nullthrows';
import React from 'react';
import {SelectedState} from '../constants';

type Props = HunkProps;

function getExtraData(props: Props): ExtraFileChangesData {
  return (nullthrows(props.extraData): any);
}

function getHunkData(props: Props): HunkData {
  const hunks = nullthrows(getExtraData(props).fileData.chunks);
  return nullthrows(hunks.get(props.hunk.oldStart));
}

export class SelectHunkChanges extends React.Component {
  props: Props;
  _editor: ?atom$TextEditor;
  _hunkData: HunkData;
  _onToggleHunk: () => mixed;

  constructor(props: Props) {
    super(props);

    const {actionCreators, fileData: {id: fileId}, patchId} = getExtraData(props);
    this._onToggleHunk = () => actionCreators.toggleHunk(patchId, fileId, props.hunk.oldStart);

    this._hunkData = getHunkData(props);
  }

  shouldComponentUpdate(nextProps: Props): boolean {
    const newHunkData = getHunkData(nextProps);
    if (newHunkData !== this._hunkData) {
      this._hunkData = newHunkData;
      return true;
    }
    return false;
  }

  render(): React.Element<any> {
    return (
      <div className="nuclide-patch-editor-select-hunk-changes">
        <Checkbox
          checked={this._hunkData.selected === SelectedState.ALL}
          indeterminate={this._hunkData.selected === SelectedState.SOME}
          onChange={this._onToggleHunk}
        />
        <div className="nuclide-patch-editor-hunk-changes">
          <HunkDiff {...this.props} ref={hunk => { this._editor = hunk && hunk.editor; }} />
        </div>
      </div>
    );
  }
}
