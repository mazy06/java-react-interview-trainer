import type { AlgoCategoryMeta, AlgoKata } from '../types/algorithm'

export const ALGO_CATEGORIES: AlgoCategoryMeta[] = [
  { key: 'arrays', label: 'Tableaux, chaînes & fenêtres' },
  { key: 'sorting', label: 'Recherche & tri' },
  { key: 'linkedlist', label: 'Listes chaînées' },
  { key: 'trees', label: 'Arbres & graphes' },
  { key: 'dp', label: 'Programmation dynamique & glouton' },
  { key: 'advanced', label: 'Structures avancées & concurrence Java' },
  { key: 'perf', label: 'Performance React / JS' },
]

export const ALGORITHM_KATAS: AlgoKata[] = [
  {
    id: 'two-sum',
    category: 'arrays',
    title: 'Two Sum',
    problem: "Trouver deux indices dont les valeurs s'additionnent à une cible donnée.",
    approaches: [
      { label: 'Double boucle', time: 'O(n²)', tier: 4, space: 'O(1)' },
      { label: 'HashMap (une passe)', time: 'O(n)', tier: 2, space: 'O(n)' },
    ],
    lang: 'java',
    code: `static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) return new int[]{seen.get(complement), i};
        seen.put(nums[i], i);
    }
    throw new IllegalArgumentException("Aucune paire trouvée");
}`,
    verdict:
      "On échange O(n) d'espace contre O(n) de temps au lieu de O(n²) — rentable dès quelques dizaines d'éléments.",
  },
  {
    id: 'detect-duplicate',
    category: 'arrays',
    title: 'Détecter un doublon',
    problem: 'Un tableau contient-il une valeur en double ?',
    approaches: [
      { label: 'Double boucle', time: 'O(n²)', tier: 4, space: 'O(1)' },
      { label: 'Tri puis scan', time: 'O(n log n)', tier: 3, space: 'O(1)' },
      { label: 'HashSet', time: 'O(n)', tier: 2, space: 'O(n)' },
    ],
    lang: 'java',
    code: `static boolean hasDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int n : nums) if (!seen.add(n)) return true;
    return false;
}`,
    verdict:
      'Le tri en place reste préférable si la mémoire est contrainte ; le HashSet gagne si le temps prime.',
  },
  {
    id: 'anagram',
    category: 'arrays',
    title: 'Anagramme',
    problem: "Deux chaînes sont-elles des anagrammes l'une de l'autre ?",
    approaches: [
      { label: 'Trier puis comparer', time: 'O(n log n)', tier: 3, space: 'O(n)' },
      { label: 'Comptage de fréquences', time: 'O(n)', tier: 2, space: 'O(1)' },
    ],
    lang: 'java',
    code: `static boolean isAnagram(String a, String b) {
    if (a.length() != b.length()) return false;
    int[] freq = new int[26];
    for (char c : a.toCharArray()) freq[c - 'a']++;
    for (char c : b.toCharArray()) if (--freq[c - 'a'] < 0) return false;
    return true;
}`,
    verdict:
      "Le comptage évite le coût O(n log n) du tri — c'est un problème de fréquence, pas d'ordre.",
  },
  {
    id: 'first-unique-char',
    category: 'arrays',
    title: 'Premier caractère non répété',
    problem: "Trouver le premier caractère d'une chaîne qui n'apparaît qu'une fois.",
    approaches: [
      { label: 'Recompter à chaque position', time: 'O(n²)', tier: 4, space: 'O(1)' },
      { label: 'Table de fréquences', time: 'O(n)', tier: 2, space: 'O(n)' },
    ],
    lang: 'java',
    code: `static char firstUniqueChar(String s) {
    Map<Character, Integer> freq = new LinkedHashMap<>();
    for (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);
    for (var e : freq.entrySet()) if (e.getValue() == 1) return e.getKey();
    return '\\0';
}`,
    verdict: 'Une table de hachage transforme un problème quadratique en deux passes linéaires.',
  },
  {
    id: 'kadane',
    category: 'arrays',
    title: 'Sous-tableau de somme maximale (Kadane)',
    problem: 'Trouver la somme contiguë maximale dans un tableau.',
    approaches: [
      { label: 'Tester tous les sous-tableaux', time: 'O(n²)', tier: 4, space: 'O(1)' },
      { label: 'Algorithme de Kadane', time: 'O(n)', tier: 2, space: 'O(1)' },
    ],
    lang: 'java',
    code: `static int maxSubArray(int[] nums) {
    int best = nums[0], current = nums[0];
    for (int i = 1; i < nums.length; i++) {
        current = Math.max(nums[i], current + nums[i]);
        best = Math.max(best, current);
    }
    return best;
}`,
    verdict: "Un cumul déjà négatif ne peut jamais aider la suite — pas besoin de le retester.",
  },
  {
    id: 'sliding-window-max-sum',
    category: 'arrays',
    title: 'Fenêtre glissante — somme max de taille k',
    problem: 'Trouver la somme maximale sur toute sous-fenêtre de taille k.',
    approaches: [
      { label: 'Recalculer chaque fenêtre', time: 'O(n·k)', tier: 4, space: 'O(1)' },
      { label: 'Fenêtre glissante', time: 'O(n)', tier: 2, space: 'O(1)' },
    ],
    lang: 'java',
    code: `static int maxSumWindow(int[] nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    int best = windowSum;
    for (int i = k; i < nums.length; i++) {
        windowSum += nums[i] - nums[i - k];
        best = Math.max(best, windowSum);
    }
    return best;
}`,
    verdict: "Réutiliser la somme précédente évite de recompter k éléments à chaque décalage.",
  },
  {
    id: 'two-pointers-sorted',
    category: 'arrays',
    title: 'Paire triée dont la somme = cible',
    problem: 'Dans un tableau déjà trié, trouver deux indices dont la somme égale une cible.',
    approaches: [
      { label: 'Double boucle', time: 'O(n²)', tier: 4, space: 'O(1)' },
      { label: 'HashMap', time: 'O(n)', tier: 2, space: 'O(n)' },
      { label: 'Deux pointeurs', time: 'O(n)', tier: 2, space: 'O(1)' },
    ],
    lang: 'java',
    code: `static int[] twoSumSorted(int[] sorted, int target) {
    int left = 0, right = sorted.length - 1;
    while (left < right) {
        int sum = sorted[left] + sorted[right];
        if (sum == target) return new int[]{left, right};
        if (sum < target) left++; else right--;
    }
    return new int[]{-1, -1};
}`,
    verdict: "Exploiter le tri existant bat le HashMap en espace (O(1) au lieu de O(n)).",
  },
  {
    id: 'pattern-search',
    category: 'arrays',
    title: 'Recherche de motif dans une chaîne',
    problem: 'Une chaîne contient-elle un motif donné ?',
    approaches: [
      { label: 'Comparaison naïve', time: 'O(n·m)', tier: 4, space: 'O(1)' },
      { label: 'Knuth-Morris-Pratt', time: 'O(n+m)', tier: 2, space: 'O(m)' },
    ],
    lang: 'java',
    code: `// lps[] = table des plus longs préfixes-suffixes du motif, construite en O(m)
static boolean contains(String text, String pattern, int[] lps) {
    int i = 0, j = 0;
    while (i < text.length()) {
        if (text.charAt(i) == pattern.charAt(j)) { i++; j++; }
        if (j == pattern.length()) return true;
        else if (i < text.length() && text.charAt(i) != pattern.charAt(j)) {
            if (j != 0) j = lps[j - 1]; else i++;
        }
    }
    return false;
}`,
    verdict:
      "KMP ne revient jamais en arrière dans le texte, contre O(n·m) au pire pour l'approche naïve.",
  },
  {
    id: 'binary-search',
    category: 'sorting',
    title: 'Recherche binaire',
    problem: 'Trouver un élément dans un tableau trié.',
    approaches: [
      { label: 'Recherche linéaire', time: 'O(n)', tier: 2, space: 'O(1)' },
      { label: 'Dichotomie', time: 'O(log n)', tier: 1, space: 'O(1)' },
    ],
    lang: 'java',
    code: `static int binarySearch(int[] sorted, int target) {
    int lo = 0, hi = sorted.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (sorted[mid] == target) return mid;
        if (sorted[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}`,
    verdict:
      "Diviser l'espace par 2 à chaque étape bat toute recherche linéaire — mais exige un tableau trié.",
  },
  {
    id: 'quicksort',
    category: 'sorting',
    title: 'QuickSort',
    problem: 'Trier un tableau en place.',
    approaches: [
      { label: 'Tri par insertion', time: 'O(n²)', tier: 4, space: 'O(1)' },
      { label: 'QuickSort (moyen)', time: 'O(n log n)', tier: 3, space: 'O(log n)' },
      { label: 'QuickSort (pire cas)', time: 'O(n²)', tier: 4, space: 'O(n)' },
    ],
    lang: 'java',
    code: `static void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++) if (a[j] < pivot) swap(a, i++, j);
    swap(a, i, hi);
    quickSort(a, lo, i - 1);
    quickSort(a, i + 1, hi);
}`,
    verdict:
      "Rapide et en place en pratique, mais dégénère en O(n²) sur un tableau déjà trié avec un pivot naïf.",
  },
  {
    id: 'mergesort',
    category: 'sorting',
    title: 'MergeSort',
    problem: 'Trier un tableau avec une garantie de performance quel que soit le cas.',
    approaches: [{ label: 'MergeSort', time: 'O(n log n)', tier: 3, space: 'O(n)' }],
    lang: 'java',
    code: `static int[] mergeSort(int[] a) {
    if (a.length <= 1) return a;
    int mid = a.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(a, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(a, mid, a.length));
    return merge(left, right);
}`,
    verdict:
      'Garanti O(n log n) dans tous les cas (contrairement à QuickSort), au prix de O(n) d’espace.',
  },
  {
    id: 'counting-sort',
    category: 'sorting',
    title: 'Tri par comptage',
    problem: 'Trier des entiers bornés dans un intervalle [0, k].',
    approaches: [
      { label: 'Tri par comparaison', time: 'O(n log n)', tier: 3, space: 'O(1)' },
      { label: 'Counting sort', time: 'O(n+k)', tier: 2, space: 'O(k)' },
    ],
    lang: 'java',
    code: `static int[] countingSort(int[] a, int maxValue) {
    int[] count = new int[maxValue + 1];
    for (int v : a) count[v]++;
    int[] result = new int[a.length];
    int idx = 0;
    for (int v = 0; v <= maxValue; v++)
        for (int c = 0; c < count[v]; c++) result[idx++] = v;
    return result;
}`,
    verdict:
      "Bat la borne O(n log n) des tris par comparaison — seulement si k reste raisonnable.",
  },
  {
    id: 'kth-largest',
    category: 'sorting',
    title: 'K-ième plus grand élément',
    problem: 'Trouver le k-ième plus grand élément sans trier tout le tableau.',
    approaches: [
      { label: 'Trier tout', time: 'O(n log n)', tier: 3, space: 'O(1)' },
      { label: 'Tas de taille k', time: 'O(n log k)', tier: 3, space: 'O(k)' },
      { label: 'Quickselect (moyen)', time: 'O(n)', tier: 2, space: 'O(1)' },
    ],
    lang: 'java',
    code: `static int kthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int n : nums) {
        minHeap.offer(n);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.peek();
}`,
    verdict:
      "Le tas évite de trier tout le tableau ; Quickselect va plus loin en évitant même de trier les k retenus.",
  },
  {
    id: 'sorted-matrix-search',
    category: 'sorting',
    title: 'Recherche dans une matrice triée',
    problem: 'Chercher une valeur dans une matrice dont lignes et colonnes sont croissantes.',
    approaches: [
      { label: 'Parcours complet', time: 'O(m·n)', tier: 4, space: 'O(1)' },
      { label: 'Depuis le coin supérieur droit', time: 'O(m+n)', tier: 2, space: 'O(1)' },
    ],
    lang: 'java',
    code: `static boolean searchMatrix(int[][] matrix, int target) {
    int row = 0, col = matrix[0].length - 1;
    while (row < matrix.length && col >= 0) {
        int val = matrix[row][col];
        if (val == target) return true;
        if (val > target) col--; else row++;
    }
    return false;
}`,
    verdict: 'Chaque comparaison élimine une ligne ou une colonne entière — de O(m·n) à O(m+n).',
  },
  {
    id: 'reverse-linked-list',
    category: 'linkedlist',
    title: 'Inverser une liste chaînée',
    problem: "Inverser le sens des pointeurs d'une liste chaînée simple.",
    approaches: [
      { label: 'Itérative (3 pointeurs)', time: 'O(n)', tier: 2, space: 'O(1)' },
      { label: 'Récursive', time: 'O(n)', tier: 2, space: 'O(n)' },
    ],
    lang: 'java',
    code: `static Node reverse(Node head) {
    Node prev = null;
    while (head != null) {
        Node next = head.next;
        head.next = prev;
        prev = head;
        head = next;
    }
    return prev;
}`,
    verdict:
      "Même temps, mais l'itérative évite tout risque de StackOverflowError sur une longue liste.",
  },
  {
    id: 'detect-cycle',
    category: 'linkedlist',
    title: 'Détecter un cycle (tortue et lièvre)',
    problem: 'Une liste chaînée contient-elle un cycle ?',
    approaches: [
      { label: 'HashSet des nœuds visités', time: 'O(n)', tier: 2, space: 'O(n)' },
      { label: 'Floyd (deux vitesses)', time: 'O(n)', tier: 2, space: 'O(1)' },
    ],
    lang: 'java',
    code: `static boolean hasCycle(Node head) {
    Node slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    verdict:
      'Même complexité en temps que le HashSet, mais espace constant — le classique testé en entretien.',
  },
  {
    id: 'merge-sorted-lists',
    category: 'linkedlist',
    title: 'Fusionner deux listes triées',
    problem: 'Fusionner deux listes chaînées déjà triées en une seule liste triée.',
    approaches: [{ label: 'Fusion avec nœud sentinelle', time: 'O(n+m)', tier: 2, space: 'O(1)' }],
    lang: 'java',
    code: `static Node merge(Node a, Node b) {
    Node dummy = new Node(0), tail = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { tail.next = a; a = a.next; }
        else { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = (a != null) ? a : b;
    return dummy.next;
}`,
    verdict: "Un nœud sentinelle (dummy) évite de traiter le premier nœud comme un cas particulier.",
  },
  {
    id: 'bfs-vs-dfs',
    category: 'trees',
    title: 'BFS vs DFS',
    problem: 'Parcourir un graphe ou un arbre.',
    approaches: [
      { label: 'BFS (largeur)', time: 'O(V+E)', tier: 2, space: 'O(V)' },
      { label: 'DFS (profondeur)', time: 'O(V+E)', tier: 2, space: 'O(h)' },
    ],
    lang: 'java',
    code: `static void bfs(Map<Integer, List<Integer>> graph, int start) {
    Queue<Integer> queue = new LinkedList<>(List.of(start));
    Set<Integer> visited = new HashSet<>(List.of(start));
    while (!queue.isEmpty()) {
        int node = queue.poll();
        for (int next : graph.getOrDefault(node, List.of()))
            if (visited.add(next)) queue.add(next);
    }
}`,
    verdict:
      'Même temps — le choix dépend du besoin : plus court chemin → BFS, exploration/backtracking → DFS.',
  },
  {
    id: 'tree-height-balance',
    category: 'trees',
    title: "Hauteur & équilibre d'un arbre binaire",
    problem: 'Vérifier si un arbre binaire est équilibré.',
    approaches: [
      { label: 'Recalculer la hauteur à chaque nœud', time: 'O(n log n)', tier: 3, space: 'O(h)' },
      { label: 'Calcul bottom-up en une passe', time: 'O(n)', tier: 2, space: 'O(h)' },
    ],
    lang: 'java',
    code: `static int height(TreeNode node) {
    if (node == null) return 0;
    return 1 + Math.max(height(node.left), height(node.right));
}`,
    verdict:
      "Combiner hauteur et vérification d'équilibre en une récursion évite de retraverser les mêmes sous-arbres.",
  },
  {
    id: 'lca-bst',
    category: 'trees',
    title: 'Plus proche ancêtre commun (BST)',
    problem:
      "Trouver l'ancêtre commun le plus bas de deux nœuds dans un arbre binaire de recherche.",
    approaches: [
      { label: 'Arbre binaire quelconque', time: 'O(n)', tier: 2, space: 'O(h)' },
      { label: 'Descente directe (BST)', time: 'O(h)', tier: 1, space: 'O(1)' },
    ],
    lang: 'java',
    code: `static TreeNode lowestCommonAncestor(TreeNode root, int p, int q) {
    TreeNode node = root;
    while (node != null) {
        if (p < node.val && q < node.val) node = node.left;
        else if (p > node.val && q > node.val) node = node.right;
        else return node;
    }
    return null;
}`,
    verdict:
      "La propriété d'ordre d'un BST transforme un parcours en une simple descente — inapplicable sur un arbre non trié.",
  },
  {
    id: 'union-find',
    category: 'trees',
    title: 'Union-Find (cycle dans un graphe)',
    problem: "Détecter un cycle ou des composantes connexes à mesure que des arêtes s'ajoutent.",
    approaches: [
      { label: 'DFS/BFS à chaque ajout', time: 'O(V+E)', tier: 2, space: 'O(V)' },
      { label: 'Union-Find + compression', time: 'O(α(n)) amorti', tier: 1, space: 'O(V)' },
    ],
    lang: 'java',
    code: `static int find(int[] parent, int x) {
    if (parent[x] != x) parent[x] = find(parent, parent[x]); // compression de chemin
    return parent[x];
}
static void union(int[] parent, int a, int b) {
    parent[find(parent, a)] = find(parent, b);
}`,
    verdict:
      "La compression de chemin rend chaque recherche quasi instantanée pour un grand nombre d'arêtes.",
  },
  {
    id: 'fibonacci',
    category: 'dp',
    title: 'Fibonacci',
    problem: 'Calculer le n-ième terme de la suite de Fibonacci.',
    approaches: [
      { label: 'Récursion naïve', time: 'O(2ⁿ)', tier: 4, space: 'O(n)' },
      { label: 'Mémoïsation', time: 'O(n)', tier: 2, space: 'O(n)' },
      { label: 'Itératif', time: 'O(n)', tier: 2, space: 'O(1)' },
    ],
    lang: 'java',
    code: `static long fibonacci(int n) {
    long a = 0, b = 1;
    for (int i = 0; i < n; i++) { long next = a + b; a = b; b = next; }
    return a;
}`,
    verdict:
      "La mémoïsation élimine la recomputation exponentielle ; l'itératif élimine aussi la pile d'appels.",
  },
  {
    id: 'coin-change',
    category: 'dp',
    title: 'Rendu de monnaie (nombre minimal de pièces)',
    problem: 'Rendre un montant avec le moins de pièces possible.',
    approaches: [
      {
        label: 'Glouton (plus grande pièce d’abord)',
        time: 'O(montant)',
        tier: 2,
        space: 'O(1)',
        caution: true,
      },
      { label: 'Programmation dynamique', time: 'O(montant · pièces)', tier: 3, space: 'O(montant)' },
    ],
    lang: 'java',
    code: `static int minCoins(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, Integer.MAX_VALUE - 1);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        for (int c : coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    return dp[amount];
}`,
    verdict:
      "Piège classique : le glouton est plus rapide mais pas toujours correct (ex. pièces 1, 3, 4 pour 6) ; la DP l'est toujours.",
  },
  {
    id: 'knapsack',
    category: 'dp',
    title: 'Sac à dos 0/1',
    problem:
      'Maximiser la valeur transportée sous une contrainte de poids, chaque objet pris au plus une fois.',
    approaches: [
      { label: 'Tous les sous-ensembles', time: 'O(2ⁿ)', tier: 4, space: 'O(n)' },
      { label: 'DP (tableau 1D)', time: 'O(n · capacité)', tier: 3, space: 'O(capacité)' },
    ],
    lang: 'java',
    code: `static int knapsack(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++)
        for (int w = capacity; w >= weights[i]; w--)
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    return dp[capacity];
}`,
    verdict:
      "Parcourir la capacité à l'envers évite de réutiliser un même objet deux fois — piège classique.",
  },
  {
    id: 'lru-cache',
    category: 'advanced',
    title: 'LRU Cache',
    problem: 'Implémenter un cache à éviction LRU (Least Recently Used) en O(1).',
    approaches: [
      { label: 'Liste + recherche linéaire', time: 'O(n)', tier: 2, space: 'O(n)' },
      { label: 'HashMap + liste doublement chaînée', time: 'O(1)', tier: 1, space: 'O(n)' },
    ],
    lang: 'java',
    code: `class LRUCache extends LinkedHashMap<Integer, Integer> {
    private final int capacity;
    LRUCache(int capacity) { super(16, 0.75f, true); this.capacity = capacity; }
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}`,
    verdict:
      "LinkedHashMap en mode accessOrder réordonne seul les entrées — pas besoin de coder la liste chaînée à la main.",
  },
  {
    id: 'producer-consumer',
    category: 'advanced',
    title: 'Producteur-Consommateur',
    problem: 'Faire communiquer des threads producteurs et consommateurs sans se marcher dessus.',
    approaches: [
      {
        label: 'wait()/notify() manuels',
        time: 'O(1)',
        tier: 2,
        space: 'O(1)',
        caution: true,
      },
      { label: 'BlockingQueue', time: 'O(1)', tier: 1, space: 'O(1)' },
    ],
    lang: 'java',
    code: `BlockingQueue<Task> queue = new LinkedBlockingQueue<>(100);
// Producteur
queue.put(task);   // bloque si la file est pleine
// Consommateur
Task task = queue.take(); // bloque si la file est vide`,
    verdict:
      'Même complexité, mais wait/notify expose à des bugs subtils (réveils intempestifs, interblocages) que BlockingQueue évite nativement.',
  },
  {
    id: 'debounce',
    category: 'perf',
    title: 'Debounce',
    problem:
      "Retarder l'exécution d'une fonction jusqu'à ce que l'utilisateur arrête d'agir (ex. champ de recherche).",
    approaches: [
      { label: 'Sans debounce', time: 'O(n) appels', tier: 4, space: '—' },
      { label: 'Avec debounce', time: 'O(1) appel', tier: 1, space: 'O(1)' },
    ],
    lang: 'javascript',
    code: `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
    verdict:
      "Annule le minuteur précédent à chaque appel — seule la dernière frappe après la pause déclenche fn.",
  },
  {
    id: 'throttle',
    category: 'perf',
    title: 'Throttle',
    problem: "Limiter la fréquence d'exécution d'une fonction (ex. gestion du scroll).",
    approaches: [
      { label: 'Sans throttle', time: 'O(n) appels', tier: 4, space: '—' },
      { label: 'Avec throttle', time: 'O(n/k) appels', tier: 2, space: 'O(1)' },
    ],
    lang: 'javascript',
    code: `function throttle(fn, limit) {
  let inCooldown = false;
  return (...args) => {
    if (inCooldown) return;
    fn(...args);
    inCooldown = true;
    setTimeout(() => (inCooldown = false), limit);
  };
}`,
    verdict:
      "Contrairement au debounce, le throttle garantit une exécution régulière même si l'activité ne s'arrête jamais.",
  },
  {
    id: 'deep-clone',
    category: 'perf',
    title: "Deep clone d'un objet",
    problem: "Dupliquer un objet en profondeur, sans référence partagée avec l'original.",
    approaches: [
      {
        label: 'JSON.parse(JSON.stringify())',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        caution: true,
      },
      { label: 'structuredClone()', time: 'O(n)', tier: 2, space: 'O(n)' },
    ],
    lang: 'javascript',
    code: `const clone = structuredClone(original);
// natif depuis Node 17 / navigateurs modernes`,
    verdict:
      'Même complexité, mais structuredClone gère Date, Map, Set et les cycles que JSON casse silencieusement.',
  },
  {
    id: 'memoization',
    category: 'perf',
    title: 'Mémoïsation',
    problem: "Éviter de recalculer le résultat d'une fonction pure pour des arguments déjà vus.",
    approaches: [
      { label: 'Sans cache', time: 'O(n) recalculs', tier: 2, space: 'O(1)' },
      { label: 'Avec cache (Map)', time: 'O(1) amorti', tier: 1, space: 'O(n)' },
    ],
    lang: 'javascript',
    code: `function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}`,
    verdict:
      'Exactement le principe derrière useMemo/useCallback en React — éviter un calcul ou une fonction déjà identique.',
  },
  {
    id: 'list-virtualization',
    category: 'perf',
    title: 'Virtualisation de liste',
    problem: 'Afficher une liste de 10 000 éléments sans tout monter dans le DOM.',
    approaches: [
      { label: 'Rendu complet', time: 'O(n) nœuds DOM', tier: 4, space: 'O(n)' },
      { label: 'Fenêtrage (windowing)', time: 'O(visible)', tier: 1, space: 'O(visible)' },
    ],
    lang: 'javascript',
    code: `const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + Math.ceil(viewportHeight / itemHeight);
const visibleItems = allItems.slice(startIndex, endIndex);`,
    verdict:
      "Le coût de rendu devient indépendant de la taille totale — seul le nombre d'éléments visibles compte.",
  },
  {
    id: 'flatten-array',
    category: 'perf',
    title: 'Aplatir un tableau imbriqué',
    problem: 'Transformer un tableau imbriqué à profondeur variable en tableau plat.',
    approaches: [
      {
        label: 'Boucles à profondeur fixe',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        caution: true,
      },
      { label: 'Récursion générique', time: 'O(n)', tier: 2, space: 'O(n)' },
    ],
    lang: 'javascript',
    code: `function flatten(arr) {
  return arr.reduce(
    (flat, item) => flat.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
}
// Équivalent natif : arr.flat(Infinity)`,
    verdict:
      "La récursion s'adapte à n'importe quelle profondeur, contrairement à des boucles imbriquées codées en dur.",
  },
]
