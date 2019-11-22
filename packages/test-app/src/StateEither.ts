import * as E from "fp-ts/lib/Either";
import { Monad3 } from "fp-ts/lib/Monad";
import { pipeable } from "fp-ts/lib/pipeable";
// import { State } from "fp-ts/lib/State";
import { getStateM } from "fp-ts/lib/StateT";
import { MonadThrow3 } from "fp-ts/lib/MonadThrow";

const T = getStateM(E.either);

declare module "fp-ts/lib/HKT" {
  interface URItoKind3<R, E, A> {
    StateEither: StateEither<R, E, A>;
  }
}

export const URI = "StateEither";

export type URI = typeof URI;

export interface StateEither<S, E, A> {
  (s: S): E.Either<E, [A, S]>;
}

export function run<S, E, A>(
  ma: StateEither<S, E, A>,
  s: S
): E.Either<E, [A, S]> {
  return ma(s);
}

export function left<S, E = never, A = never>(e: E): StateEither<S, E, A> {
  return T.fromM(E.left(e));
}

export const right: <S, E = never, A = never>(a: A) => StateEither<S, E, A> =
  T.of;

export const get: <S, E = never>() => StateEither<S, E, S> = T.get;

export const put: <S, E = never>(s: S) => StateEither<S, E, void> = T.put;

export const modify: <S, E = never>(f: (s: S) => S) => StateEither<S, E, void> =
  T.modify;

export const stateEither: Monad3<URI> & MonadThrow3<URI> = {
  URI,
  map: T.map,
  of: right,
  ap: T.ap,
  chain: T.chain,
  throwError: left
};

const {
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  flatten,
  map,
  fromEither,
  fromOption
} = pipeable(stateEither);

export {
  ap,
  apFirst,
  apSecond,
  chain,
  chainFirst,
  flatten,
  map,
  fromEither,
  fromOption
};
