import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { RootState } from './store';
import { GLTest } from './GLTest';

type Props = DispatchProp;

const GLTestContainer: React.FC<Props> = ({ dispatch }) => {
	return <GLTest dispatch={dispatch} />;
};

export default connect<{}, {}, {}, RootState>((st) => st)(GLTestContainer);
