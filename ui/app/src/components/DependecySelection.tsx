import React, { useState, useEffect } from 'react';
import { Item } from '../models/Item';
import '../styles/dependency-selection.scss';
import { withStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import { get } from '../utils/ajax';

interface DependecySelectionProps {
  items: Item[];
  onChange: Function;
  siteId: string;
}

interface DepsObject {
  hard: [],
  soft: []
}

const CenterCircularProgress = withStyles({
  root: {
    justifyContent: 'center',
    color: '#7e9dbb',
    width: '30px!important',
    height: '30px!important',
    marginRight: '10px'
  }
})(CircularProgress);

const BlueCheckbox = withStyles({
  root: {
    color: '#7e9dbb',
    padding: '2px',
    '&$checked': {
      color: '#7e9dbb',
    },
  },
  checked: {},
})(Checkbox);

declare const CStudioAuthoring: any;
declare const CStudioAuthoringContext: any;

function DependecySelection(props: DependecySelectionProps) {
  const [deps, setDeps] = useState<DepsObject>();
  const [showDepBtn, setshowDepBtn] = useState(true);
  const { items, siteId } = props;
  const [checked, _setChecked] = useState<any>(
    (items || []).reduce(
      (table: any, item) => {
        table[item.uri] = true;
        return table;
      },
      {}
    )
  );

  const setChecked = (uri: string[], isChecked: boolean) => {
    const nextChecked = { ...checked };
    (Array.isArray(uri) ? uri : [uri]).forEach((u) => {
      nextChecked[u] = isChecked;
    });
    _setChecked(nextChecked);
    setshowDepBtn(true);
    setDeps(null);
    cleanCheckedSoftDep();
  }

  const paths =
    Object.entries({ ...checked })
      .filter(([key, value]) => value === true)
      .map(([key]) => key);

  const [checkedSoftDep, _setCheckedSoftDep] = useState<any>({});
  const setCheckedSoftDep = (uri: string[], isChecked: boolean) => {
    const nextCheckedSoftDep = { ...checkedSoftDep };
    (Array.isArray(uri) ? uri : [uri]).forEach((u) => {
      nextCheckedSoftDep[u] = isChecked;
    });
    _setCheckedSoftDep(nextCheckedSoftDep);
  }
  const cleanCheckedSoftDep = () => {
    const nextCheckedSoftDep = {};

    _setCheckedSoftDep(nextCheckedSoftDep);
  }

  const Messages = CStudioAuthoring.Messages;
  const bundle = Messages.getBundle('forms', CStudioAuthoringContext.lang);
  const selectAllMessage = Messages.format(bundle, 'selectAll');
  const hardDependencies = Messages.format(bundle, 'hardDependencies');
  const submissionMandatory = Messages.format(bundle, 'submissionMandatory');
  const softDependencies = Messages.format(bundle, 'softDependencies');
  const submissionOptional = Messages.format(bundle, 'submissionOptional');
  const itemsForPublish = Messages.format(bundle, 'itemsForPublish');
  const showAllDependenciesMessage = Messages.format(bundle, 'showAllDependencies');
  const changesSelectioItems = Messages.format(bundle, 'changesSelectioItems');
  const loadingDependencies = Messages.format(bundle, 'loadingDependencies');

  useEffect(
    () => {
      setRef();
    },
    [checked, checkedSoftDep],
  );

  return (
    <div>
      <div className="dependency-selection">
        <h2 className="dependency-selection--title dependency-selection--publish-title">
          {itemsForPublish}
        </h2>
        <button className="dependency-selection--nav-btn dependency-selection--select-all" onClick={selectAll}>
          {selectAllMessage}
        </button>
        {
          items.map((item) => (
            <div className="dependency-selection--section-dependencies" key={item.uri}>
              <div className="dependency-selection--checkbox">
                <BlueCheckbox
                  checked={!!checked[item.uri]}
                  onClick={(e: any) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setChecked([item.uri], !checked[item.uri])
                  }}
                  onChange={(e) => { }}
                  value={item.uri}
                  color="primary"
                />
              </div>
              <div className="dependency-selection--information">
                <div className="dependency-selection--information--internal-name">{item.internalName}</div>
                <div className="dependency-selection--information--uri">&nbsp;{item.uri}</div>
              </div>
            </div>
          ))
        }
        {
          deps == null ? (null) : (
            <div>
              <h2 className="dependency-selection--subtitle" >
                {hardDependencies}
              </h2>
              <span> • {submissionMandatory}</span>
              <ul className="dependency-selection--list">
                {
                  deps && deps.hard
                    ? (
                      deps.hard.map((uri: string) => (
                        <li className="dependency-selection--list--hard" key={uri}>{uri}</li>
                      ))
                    )
                    : (null)
                }
              </ul>
              <h2 className="dependency-selection--subtitle">
                {softDependencies}
              </h2>
              <span> • {submissionOptional}</span>
              <button className="dependency-selection--nav-btn" onClick={selectAllSoft}>
                {selectAllMessage}
              </button>
              <ul className="dependency-selection--list" >
                {
                  deps && deps.soft
                    ? (
                      deps.soft.map((uri: string) => (
                        <li key={uri}>
                          <div className="dependency-selection--list--soft-checkbox" >
                            <BlueCheckbox
                              checked={!!checkedSoftDep[uri]}
                              onChange={(e) => setCheckedSoftDep([uri], e.target.checked)}
                              value={uri}
                              color="primary"
                            />
                          </div>
                          <div className="dependency-selection--list--soft-item" >{uri}</div>
                        </li>
                      ))
                    )
                    : (null)
                }
              </ul>
            </div>
          )
        }
      </div>
      <div className="dependency-selection--bottom-section">
        {
          (deps == null && !showDepBtn) ? (
            <div className="centerCircularProgress">
              <CenterCircularProgress /> <span className="dependency-selection--center-circular-progress-text" >{loadingDependencies}</span>
            </div>
          ) : (
              showDepBtn ? (
                <button className="dependency-selection--nav-btn dependency-selection--show-all" onClick={showAllDependencies}>
                  {showAllDependenciesMessage}
                </button>
              ) : (null)
            )
        }
        <p>
          {changesSelectioItems}
        </p>
      </div>
    </div>
  );

  function selectAll() {
    setChecked(items.map(i => i.uri), true);
  }

  function selectAllSoft() {
    setCheckedSoftDep(deps.soft, true);
  }

  function setRef() {
    const result = Object.entries({ ...checked, ...checkedSoftDep })
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
    props.onChange(result);
  }

  function showAllDependencies() {
    setshowDepBtn(false);
    get(`/studio/api/2/dependency/dependencies?siteId=${siteId}&paths=${paths}`)
      .subscribe(
        (response: any) => {
          setDeps({
            hard: response.response.items.hardDependencies,
            soft: response.response.items.softDependencies
          });
        },
        () => {
          setDeps({
            hard: [],
            soft: []
          });
        }
      );
  }

}

export default DependecySelection;
