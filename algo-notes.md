This article is to propse a simple algorithm to be implemented in this project. The author is @yzhhr on Github.

## Features I Would Expect
I would prefer if the charaters do not always move in a straight line. They may follow curvy routes to their destination so that paths of different groups of characters will not intersect.

To do this, possibly invisible lanes can be introduced. Lanes are invisible straight horizontal lines, and they are pairwise parallel. Finally every group of characters first go up or down (a vertical distance) to its assigned lane, then travel horizontally, then vertically to its destination.

What do you call a *group* of characters? Thats something new. Basically that is a pair of isomorphic subtrees from the original and final tree. For example, one would expect a block like $\dfrac{a}{b}$ move together.

However, there is pain in the structuring of LaTeX. LaTeX focuses on presentations, so it does not know when we say $a \times b + c$, the plus sign has a lower priority than the cross sign. Maybe we should introduce some tree structure for expressions like this.

Furthermore, we may introduce specific optimizations for well-known algebraic laws, like the distribution law $a(b+c)\to ab+ac$. Otherwise it can be confusing to deal with the one more $a$ that pops out halfway.

## Algorithm

There are only three cases to be distinguished:
1. A transition of position, or nodes that show up in both trees
2. Something from the original tree disappers
3. Something in the final tree pops out of nowhere

The basic idea is to perform dynamic programming. Formally we denote $T_1, T_2$ to be the two trees to be compared. The basic idea is do find out $f(u, v)$ for every $u\in T_1, v\in T_2$, where $f$ denotes a *similarity* for the two subtrees. The larger the $f$ value is, the more similar we would expect the two subtrees to be.

For a pair of leaf nodes, we would assign a good value(say, $c_1=5$) if they are identical characters. They get a comparably lower score(say, $c_2=2$) if they are different characters but they are from the same set. Or, they may be assigned a score of $0$ similarity. Usually we would consider $(a, a)$ to be identical, $(a, b)$ to be similar, $(a, \beta)$ to be less similar, $(a, +)$ to be never interchangeable.

Things get complicated when a node with its nonempty subtree is involved, or even more complicated with two nodes, each with a nonempty subtree. A typical issue to consider is that, we would expect a smooth transition from $a+b$ to $a-b$, but they are actually trees with different roots. One with plus sign, one with minus sign. One may argue that we need not tree-ify every expression as they are good when compared as strings, but they must face something like $\dfrac{a}{b}\to a\cdot b^{-1}$. The major drawback of calculation with strings is that strings fail to identify which is which when a character appears multiple times in an expression. To solve this one must tree-ify to some extent - and subsequently a complete tree-ify solution is no harder to implement than an incomplete one!

Let's first denote $g(u, v)$ as an auxiliary. It means when you compare two trees, you force the two root nodes to be aligned. $g(u, v) = MaxMatching(ch(u), ch(v))$, where the $MaxMatching$ requests a maximal weighted bipartite matching between the children of $u$ and $v$. If you match two children of $u, v$, the weight for this match is $f(u, v)$. And the final weight is summed over every pair of matches. The max is taken over every possible arrangement of match-ups. This can be solved using the Hungarian algorithm, or Kuhn-Munkres as a more popular name in China. Or alternatively a min-cost-max-flow algorithm can solve this as well, if you do not mind a tiny loss in performance.

Subsequently $g(u, v) = f(u, v)$ at leaves.

Finally we calculate $f(u, v)=\max_{x\in sub(u), y\in sub(v)}\left(g(x, y)+c_3(size(sub(x))+size(sub(y)))\right)$, with $c_3=1?$ and $size$ chosen to make sure the result we get is not too "local".

For the animation part, we shall find out exactly every pair of $g(u, v)$ that is involved - they are the critical matches we find. A critical proposition here is that for a chosen matchup with $(x, y)$ and $(u, v)$, we have $x\in sub(u) \Leftrightarrow y\in sub(v)$. But all we need is $g(u, v)$ for $u, v$ as leaves. We can pair up these pairs of leaves and erase the subtrees induced by such leaves. Then we are left with unpaired nodes. They shall undergo a similar matching process as shown above. That's to solve the problem with $x+a=b \to x=b-a$, where the tree structure totally changes. At a certain level when matching with strings appears to be unambiguous (when each character appears only once), it can also be adopted.

Overall, many parameters can be exposed to the user to adjust at every specific use of this project. Our goal is to reduce the work for teachers, but teachers always make animations best when they control every single character. Many details in this algorithm can be slightly changed depending on how the final thing works.

## How Shall I Implement This Hunk?

The algorithm above requires much effort when implementing. The developer may do the job step by step as follows:
1. The main algo. f and g and Hungarian. This job cannot be further divided.
2. Match the unpaired nodes with character compares. This works well if it can proved unambiguous.
3. (Replacing 2.) Match the unpaired nodes with a similar algo.







