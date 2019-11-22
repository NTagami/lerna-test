import * as E from "fp-ts/lib/Either";
import { getEitherM } from "fp-ts/lib/EitherT";
import { Monad3 } from "fp-ts/lib/Monad";
import { MonadThrow3 } from "fp-ts/lib/MonadThrow";
import { pipeable } from "fp-ts/lib/pipeable";
import { state, State } from "fp-ts/lib/State";

//import Either = E.Either;

const T = getEitherM(state);

declare module "fp-ts/lib/HKT" {
  interface URItoKind3<R, E, A> {
    EitherState: EitherState<R, E, A>;
  }
}

export const URI = "EitherState";

export type URI = typeof URI;

export interface EitherState<S, E, A> extends State<S, E.Either<E, A>> {}

export function run<S, E, A>(
  ma: EitherState<S, E, A>,
  s: S
): [E.Either<E, A>, S] {
  return ma(s);
}

export const left: <S, E = never, A = never>(e: E) => EitherState<S, E, A> =
  T.left;

export const right: <S, E = never, A = never>(a: A) => EitherState<S, E, A> =
  T.of;

export function get<S, E = never>(): EitherState<S, E, S> {
  return s => [E.right(s), s];
}

export function put<S, E = never>(x: S): EitherState<S, E, any> {
  return s => [E.right({}), x];
}

export function modify<S, E = never>(f: (s: S) => S): EitherState<S, E, any> {
  return s => [E.right({}), f(s)];
}

export const eitherState: Monad3<URI> & MonadThrow3<URI> = {
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
} = pipeable(eitherState);

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
