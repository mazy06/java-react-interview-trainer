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
    lang: 'java',
    approaches: [
      {
        label: 'Double boucle',
        time: 'O(n²)',
        tier: 4,
        space: 'O(1)',
        code: `static int[] twoSumNaive(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) return new int[]{i, j};
        }
    }
    throw new IllegalArgumentException("Aucune paire trouvée");
}`,
        explanation:
          "On teste toutes les paires possibles (i, j) avec j > i, et on retourne dès qu'une paire dont la somme égale la cible est trouvée.",
      },
      {
        label: 'HashMap (une passe)',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        code: `static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (seen.containsKey(complement)) return new int[]{seen.get(complement), i};
        seen.put(nums[i], i);
    }
    throw new IllegalArgumentException("Aucune paire trouvée");
}`,
        explanation:
          "On parcourt le tableau une seule fois : pour chaque nombre, on vérifie si son complément (cible − nombre) a déjà été vu et stocké dans la HashMap ; sinon, on ajoute le nombre courant à la HashMap avec son index.",
      },
    ],
    verdict:
      "On échange O(n) d'espace contre O(n) de temps au lieu de O(n²) — rentable dès quelques dizaines d'éléments.",
  },
  {
    id: 'detect-duplicate',
    category: 'arrays',
    title: 'Détecter un doublon',
    problem: 'Un tableau contient-il une valeur en double ?',
    lang: 'java',
    approaches: [
      {
        label: 'Double boucle',
        time: 'O(n²)',
        tier: 4,
        space: 'O(1)',
        code: `static boolean hasDuplicateNaive(int[] nums) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] == nums[j]) return true;
        }
    }
    return false;
}`,
        explanation:
          "On compare chaque élément à tous ceux qui le suivent ; dès qu'une paire identique est trouvée, on s'arrête.",
      },
      {
        label: 'Tri puis scan',
        time: 'O(n log n)',
        tier: 3,
        space: 'O(1)',
        code: `static boolean hasDuplicateSorted(int[] nums) {
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    for (int i = 1; i < sorted.length; i++) {
        if (sorted[i] == sorted[i - 1]) return true;
    }
    return false;
}`,
        explanation:
          "Une fois le tableau trié, deux valeurs identiques se retrouvent forcément côte à côte ; il suffit de comparer chaque élément à son prédécesseur.",
      },
      {
        label: 'HashSet',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        code: `static boolean hasDuplicate(int[] nums) {
    Set<Integer> seen = new HashSet<>();
    for (int n : nums) if (!seen.add(n)) return true;
    return false;
}`,
        explanation:
          "add() renvoie false si l'élément était déjà présent dans le Set : on le teste directement dans la condition, sans avoir besoin d'un contains() séparé avant l'ajout.",
      },
    ],
    verdict:
      'Le tri en place reste préférable si la mémoire est contrainte ; le HashSet gagne si le temps prime.',
  },
  {
    id: 'anagram',
    category: 'arrays',
    title: 'Anagramme',
    problem: "Deux chaînes sont-elles des anagrammes l'une de l'autre ?",
    lang: 'java',
    approaches: [
      {
        label: 'Trier puis comparer',
        time: 'O(n log n)',
        tier: 3,
        space: 'O(n)',
        code: `static boolean isAnagramSorted(String a, String b) {
    char[] ca = a.toCharArray(), cb = b.toCharArray();
    Arrays.sort(ca);
    Arrays.sort(cb);
    return Arrays.equals(ca, cb);
}`,
        explanation:
          'Deux chaînes sont des anagrammes si et seulement si leurs lettres triées produisent exactement la même séquence.',
      },
      {
        label: 'Comptage de fréquences',
        time: 'O(n)',
        tier: 2,
        space: 'O(1)',
        code: `static boolean isAnagram(String a, String b) {
    if (a.length() != b.length()) return false;
    int[] freq = new int[26];
    for (char c : a.toCharArray()) freq[c - 'a']++;
    for (char c : b.toCharArray()) if (--freq[c - 'a'] < 0) return false;
    return true;
}`,
        explanation:
          "On incrémente un compteur par lettre en lisant la première chaîne, puis on décrémente ces mêmes compteurs en lisant la seconde ; si un compteur devient négatif, une lettre apparaît plus souvent dans b que dans a.",
      },
    ],
    verdict:
      "Le comptage évite le coût O(n log n) du tri — c'est un problème de fréquence, pas d'ordre.",
  },
  {
    id: 'first-unique-char',
    category: 'arrays',
    title: 'Premier caractère non répété',
    problem: "Trouver le premier caractère d'une chaîne qui n'apparaît qu'une fois.",
    lang: 'java',
    approaches: [
      {
        label: 'Recompter à chaque position',
        time: 'O(n²)',
        tier: 4,
        space: 'O(1)',
        code: `static char firstUniqueCharNaive(String s) {
    for (int i = 0; i < s.length(); i++) {
        boolean unique = true;
        for (int j = 0; j < s.length(); j++) {
            if (i != j && s.charAt(i) == s.charAt(j)) { unique = false; break; }
        }
        if (unique) return s.charAt(i);
    }
    return '\\0';
}`,
        explanation:
          "Pour chaque caractère, on reparcourt toute la chaîne afin de vérifier qu'aucun autre caractère identique n'existe ailleurs.",
      },
      {
        label: 'Table de fréquences',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        code: `static char firstUniqueChar(String s) {
    Map<Character, Integer> freq = new LinkedHashMap<>();
    for (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);
    for (var e : freq.entrySet()) if (e.getValue() == 1) return e.getKey();
    return '\\0';
}`,
        explanation:
          "Une première passe compte les occurrences de chaque caractère dans une Map qui conserve l'ordre d'insertion ; une seconde passe retourne le premier caractère dont le compteur vaut exactement 1.",
      },
    ],
    verdict: 'Une table de hachage transforme un problème quadratique en deux passes linéaires.',
  },
  {
    id: 'kadane',
    category: 'arrays',
    title: 'Sous-tableau de somme maximale (Kadane)',
    problem: 'Trouver la somme contiguë maximale dans un tableau.',
    lang: 'java',
    approaches: [
      {
        label: 'Tester tous les sous-tableaux',
        time: 'O(n²)',
        tier: 4,
        space: 'O(1)',
        code: `static int maxSubArrayNaive(int[] nums) {
    int best = Integer.MIN_VALUE;
    for (int i = 0; i < nums.length; i++) {
        int sum = 0;
        for (int j = i; j < nums.length; j++) {
            sum += nums[j];
            best = Math.max(best, sum);
        }
    }
    return best;
}`,
        explanation:
          "On calcule la somme de chaque sous-tableau possible, en partant de chaque indice i et en l'étendant progressivement jusqu'à la fin, en gardant la meilleure somme trouvée.",
      },
      {
        label: 'Algorithme de Kadane',
        time: 'O(n)',
        tier: 2,
        space: 'O(1)',
        code: `static int maxSubArray(int[] nums) {
    int best = nums[0], current = nums[0];
    for (int i = 1; i < nums.length; i++) {
        current = Math.max(nums[i], current + nums[i]);
        best = Math.max(best, current);
    }
    return best;
}`,
        explanation:
          "À chaque élément, on choisit entre prolonger la somme courante ou repartir de zéro à cet élément, selon ce qui donne le plus grand résultat ; on garde en mémoire la meilleure somme rencontrée.",
      },
    ],
    verdict: "Un cumul déjà négatif ne peut jamais aider la suite — pas besoin de le retester.",
  },
  {
    id: 'sliding-window-max-sum',
    category: 'arrays',
    title: 'Fenêtre glissante — somme max de taille k',
    problem: 'Trouver la somme maximale sur toute sous-fenêtre de taille k.',
    lang: 'java',
    approaches: [
      {
        label: 'Recalculer chaque fenêtre',
        time: 'O(n·k)',
        tier: 4,
        space: 'O(1)',
        code: `static int maxSumWindowNaive(int[] nums, int k) {
    int best = Integer.MIN_VALUE;
    for (int i = 0; i <= nums.length - k; i++) {
        int sum = 0;
        for (int j = i; j < i + k; j++) sum += nums[j];
        best = Math.max(best, sum);
    }
    return best;
}`,
        explanation:
          "Pour chaque position de départ possible, on recalcule entièrement la somme des k éléments de la fenêtre, sans réutiliser le travail déjà fait pour la fenêtre précédente.",
      },
      {
        label: 'Fenêtre glissante',
        time: 'O(n)',
        tier: 2,
        space: 'O(1)',
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
        explanation:
          "On calcule la somme de la première fenêtre, puis on la fait glisser d'un cran à la fois : on ajoute l'élément qui entre dans la fenêtre et on retire celui qui en sort.",
      },
    ],
    verdict: "Réutiliser la somme précédente évite de recompter k éléments à chaque décalage.",
  },
  {
    id: 'two-pointers-sorted',
    category: 'arrays',
    title: 'Paire triée dont la somme = cible',
    problem: 'Dans un tableau déjà trié, trouver deux indices dont la somme égale une cible.',
    lang: 'java',
    approaches: [
      {
        label: 'Double boucle',
        time: 'O(n²)',
        tier: 4,
        space: 'O(1)',
        code: `static int[] twoSumSortedNaive(int[] sorted, int target) {
    for (int i = 0; i < sorted.length; i++) {
        for (int j = i + 1; j < sorted.length; j++) {
            if (sorted[i] + sorted[j] == target) return new int[]{i, j};
        }
    }
    return new int[]{-1, -1};
}`,
        explanation:
          "On ignore que le tableau est trié et on teste toutes les paires possibles, exactement comme sur un tableau quelconque.",
      },
      {
        label: 'HashMap',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        code: `static int[] twoSumSortedHashMap(int[] sorted, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < sorted.length; i++) {
        int complement = target - sorted[i];
        if (seen.containsKey(complement)) return new int[]{seen.get(complement), i};
        seen.put(sorted[i], i);
    }
    return new int[]{-1, -1};
}`,
        explanation:
          "Même technique que pour un tableau non trié : on mémorise chaque valeur vue dans une HashMap pour retrouver son complément en O(1), sans exploiter l'ordre du tableau.",
      },
      {
        label: 'Deux pointeurs',
        time: 'O(n)',
        tier: 2,
        space: 'O(1)',
        code: `static int[] twoSumSorted(int[] sorted, int target) {
    int left = 0, right = sorted.length - 1;
    while (left < right) {
        int sum = sorted[left] + sorted[right];
        if (sum == target) return new int[]{left, right};
        if (sum < target) left++; else right--;
    }
    return new int[]{-1, -1};
}`,
        explanation:
          "Un pointeur part du début et l'autre de la fin ; si la somme est trop petite on avance le pointeur gauche (pour l'augmenter), si elle est trop grande on recule le pointeur droit (pour la diminuer).",
      },
    ],
    verdict: "Exploiter le tri existant bat le HashMap en espace (O(1) au lieu de O(n)).",
  },
  {
    id: 'pattern-search',
    category: 'arrays',
    title: 'Recherche de motif dans une chaîne',
    problem: 'Une chaîne contient-elle un motif donné ?',
    lang: 'java',
    approaches: [
      {
        label: 'Comparaison naïve',
        time: 'O(n·m)',
        tier: 4,
        space: 'O(1)',
        code: `static boolean containsNaive(String text, String pattern) {
    for (int i = 0; i <= text.length() - pattern.length(); i++) {
        int j = 0;
        while (j < pattern.length() && text.charAt(i + j) == pattern.charAt(j)) j++;
        if (j == pattern.length()) return true;
    }
    return false;
}`,
        explanation:
          "Pour chaque position de départ possible dans le texte, on compare caractère par caractère avec le motif ; en cas d'échec, on recommence entièrement à la position suivante.",
      },
      {
        label: 'Knuth-Morris-Pratt',
        time: 'O(n+m)',
        tier: 2,
        space: 'O(m)',
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
        explanation:
          "Le pointeur du texte (i) n'avance jamais en arrière ; en cas d'échec, la table lps indique de combien de positions reculer le pointeur du motif (j), sans revenir sur des caractères du texte déjà comparés.",
      },
    ],
    verdict:
      "KMP ne revient jamais en arrière dans le texte, contre O(n·m) au pire pour l'approche naïve.",
  },
  {
    id: 'binary-search',
    category: 'sorting',
    title: 'Recherche binaire',
    problem: 'Trouver un élément dans un tableau trié.',
    lang: 'java',
    approaches: [
      {
        label: 'Recherche linéaire',
        time: 'O(n)',
        tier: 2,
        space: 'O(1)',
        code: `static int linearSearch(int[] sorted, int target) {
    for (int i = 0; i < sorted.length; i++) {
        if (sorted[i] == target) return i;
    }
    return -1;
}`,
        explanation:
          "On parcourt le tableau du début à la fin et on s'arrête dès qu'on trouve la cible, sans tirer parti du fait que le tableau est trié.",
      },
      {
        label: 'Dichotomie',
        time: 'O(log n)',
        tier: 1,
        space: 'O(1)',
        code: `static int binarySearch(int[] sorted, int target) {
    int lo = 0, hi = sorted.length - 1;
    while (lo <= hi) {
        int mid = lo + (hi - lo) / 2;
        if (sorted[mid] == target) return mid;
        if (sorted[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}`,
        explanation:
          "À chaque itération, on compare la cible à l'élément du milieu et on élimine la moitié du tableau qui ne peut pas la contenir, jusqu'à trouver la cible ou épuiser l'intervalle de recherche.",
      },
    ],
    verdict:
      "Diviser l'espace par 2 à chaque étape bat toute recherche linéaire — mais exige un tableau trié.",
  },
  {
    id: 'quicksort',
    category: 'sorting',
    title: 'QuickSort',
    problem: 'Trier un tableau en place.',
    lang: 'java',
    approaches: [
      {
        label: 'Tri par insertion',
        time: 'O(n²)',
        tier: 4,
        space: 'O(1)',
        code: `static void insertionSort(int[] a) {
    for (int i = 1; i < a.length; i++) {
        int key = a[i], j = i - 1;
        while (j >= 0 && a[j] > key) { a[j + 1] = a[j]; j--; }
        a[j + 1] = key;
    }
}`,
        explanation:
          "On construit la partie triée du tableau petit à petit : chaque nouvel élément est inséré à sa bonne place parmi les éléments déjà triés, en décalant les plus grands d'un cran.",
      },
      {
        label: 'QuickSort (moyen)',
        time: 'O(n log n)',
        tier: 3,
        space: 'O(log n)',
        code: `static void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++) if (a[j] < pivot) swap(a, i++, j);
    swap(a, i, hi);
    quickSort(a, lo, i - 1);
    quickSort(a, i + 1, hi);
}`,
        explanation:
          "Le dernier élément sert de pivot ; on repousse à gauche tous les éléments plus petits que lui, puis on le place à sa position finale et on trie récursivement les deux partitions de part et d'autre.",
      },
      {
        label: 'QuickSort (pire cas)',
        time: 'O(n²)',
        tier: 4,
        space: 'O(n)',
        code: `static void quickSort(int[] a, int lo, int hi) {
    if (lo >= hi) return;
    int pivot = a[hi], i = lo;
    for (int j = lo; j < hi; j++) if (a[j] < pivot) swap(a, i++, j);
    swap(a, i, hi);
    quickSort(a, lo, i - 1);
    quickSort(a, i + 1, hi);
}`,
        explanation:
          "Le code est identique à l'approche moyenne : c'est l'entrée qui change. Sur un tableau déjà trié avec ce choix de pivot (toujours le dernier élément), chaque partition ne retire qu'un seul élément, ce qui produit n niveaux de récursion au lieu de log n.",
      },
    ],
    verdict:
      "Rapide et en place en pratique, mais dégénère en O(n²) sur un tableau déjà trié avec un pivot naïf.",
  },
  {
    id: 'mergesort',
    category: 'sorting',
    title: 'MergeSort',
    problem: 'Trier un tableau avec une garantie de performance quel que soit le cas.',
    lang: 'java',
    approaches: [
      {
        label: 'MergeSort',
        time: 'O(n log n)',
        tier: 3,
        space: 'O(n)',
        code: `static int[] mergeSort(int[] a) {
    if (a.length <= 1) return a;
    int mid = a.length / 2;
    int[] left = mergeSort(Arrays.copyOfRange(a, 0, mid));
    int[] right = mergeSort(Arrays.copyOfRange(a, mid, a.length));
    return merge(left, right);
}`,
        explanation:
          "On divise le tableau en deux moitiés récursivement jusqu'à des tableaux d'un seul élément, puis on les fusionne deux à deux en ordre croissant en remontant la récursion.",
      },
    ],
    verdict:
      'Garanti O(n log n) dans tous les cas (contrairement à QuickSort), au prix de O(n) d’espace.',
  },
  {
    id: 'counting-sort',
    category: 'sorting',
    title: 'Tri par comptage',
    problem: 'Trier des entiers bornés dans un intervalle [0, k].',
    lang: 'java',
    approaches: [
      {
        label: 'Tri par comparaison',
        time: 'O(n log n)',
        tier: 3,
        space: 'O(1)',
        code: `static int[] comparisonSort(int[] a) {
    int[] copy = a.clone();
    Arrays.sort(copy); // tri par comparaison générique, ignore les bornes des valeurs
    return copy;
}`,
        explanation:
          "Un tri par comparaison générique (comme Arrays.sort) compare les éléments entre eux sans connaître leur nature bornée, d'où sa complexité incompressible en O(n log n).",
      },
      {
        label: 'Counting sort',
        time: 'O(n+k)',
        tier: 2,
        space: 'O(k)',
        code: `static int[] countingSort(int[] a, int maxValue) {
    int[] count = new int[maxValue + 1];
    for (int v : a) count[v]++;
    int[] result = new int[a.length];
    int idx = 0;
    for (int v = 0; v <= maxValue; v++)
        for (int c = 0; c < count[v]; c++) result[idx++] = v;
    return result;
}`,
        explanation:
          "On compte combien de fois chaque valeur apparaît dans un tableau indexé par la valeur elle-même, puis on reconstruit le tableau trié en parcourant ces compteurs dans l'ordre croissant.",
      },
    ],
    verdict: "Bat la borne O(n log n) des tris par comparaison — seulement si k reste raisonnable.",
  },
  {
    id: 'kth-largest',
    category: 'sorting',
    title: 'K-ième plus grand élément',
    problem: 'Trouver le k-ième plus grand élément sans trier tout le tableau.',
    lang: 'java',
    approaches: [
      {
        label: 'Trier tout',
        time: 'O(n log n)',
        tier: 3,
        space: 'O(1)',
        code: `static int kthLargestSort(int[] nums, int k) {
    int[] sorted = nums.clone();
    Arrays.sort(sorted);
    return sorted[sorted.length - k];
}`,
        explanation:
          "On trie entièrement le tableau puis on lit directement le k-ième élément à partir de la fin — simple, mais on trie inutilement tous les éléments.",
      },
      {
        label: 'Tas de taille k',
        time: 'O(n log k)',
        tier: 3,
        space: 'O(k)',
        code: `static int kthLargest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int n : nums) {
        minHeap.offer(n);
        if (minHeap.size() > k) minHeap.poll();
    }
    return minHeap.peek();
}`,
        explanation:
          "On maintient un tas-min de taille k : chaque nouvel élément est ajouté, et dès que le tas dépasse k éléments, le plus petit est retiré ; à la fin, le sommet du tas est le k-ième plus grand.",
      },
      {
        label: 'Quickselect (moyen)',
        time: 'O(n)',
        tier: 2,
        space: 'O(1)',
        code: `static int quickSelect(int[] nums, int lo, int hi, int targetIndex) {
    int pivot = nums[hi], i = lo;
    for (int j = lo; j < hi; j++) if (nums[j] > pivot) swap(nums, i++, j);
    swap(nums, i, hi);
    if (i == targetIndex) return nums[i];
    return i < targetIndex
        ? quickSelect(nums, i + 1, hi, targetIndex)
        : quickSelect(nums, lo, i - 1, targetIndex);
}`,
        explanation:
          "Comme QuickSort, on partitionne autour d'un pivot, mais on ne recurse que du côté qui contient l'index cherché — on ignore complètement l'autre moitié du tableau.",
      },
    ],
    verdict:
      "Le tas évite de trier tout le tableau ; Quickselect va plus loin en évitant même de trier les k retenus.",
  },
  {
    id: 'sorted-matrix-search',
    category: 'sorting',
    title: 'Recherche dans une matrice triée',
    problem: 'Chercher une valeur dans une matrice dont lignes et colonnes sont croissantes.',
    lang: 'java',
    approaches: [
      {
        label: 'Parcours complet',
        time: 'O(m·n)',
        tier: 4,
        space: 'O(1)',
        code: `static boolean searchMatrixNaive(int[][] matrix, int target) {
    for (int[] row : matrix) {
        for (int val : row) {
            if (val == target) return true;
        }
    }
    return false;
}`,
        explanation:
          "On inspecte chaque cellule de la matrice une par une, sans utiliser le fait que les lignes et les colonnes sont triées.",
      },
      {
        label: 'Depuis le coin supérieur droit',
        time: 'O(m+n)',
        tier: 2,
        space: 'O(1)',
        code: `static boolean searchMatrix(int[][] matrix, int target) {
    int row = 0, col = matrix[0].length - 1;
    while (row < matrix.length && col >= 0) {
        int val = matrix[row][col];
        if (val == target) return true;
        if (val > target) col--; else row++;
    }
    return false;
}`,
        explanation:
          "En partant du coin supérieur droit, une valeur trop grande élimine toute sa colonne (on va à gauche) et une valeur trop petite élimine toute sa ligne (on descend d'une ligne).",
      },
    ],
    verdict: 'Chaque comparaison élimine une ligne ou une colonne entière — de O(m·n) à O(m+n).',
  },
  {
    id: 'reverse-linked-list',
    category: 'linkedlist',
    title: 'Inverser une liste chaînée',
    problem: "Inverser le sens des pointeurs d'une liste chaînée simple.",
    lang: 'java',
    approaches: [
      {
        label: 'Itérative (3 pointeurs)',
        time: 'O(n)',
        tier: 2,
        space: 'O(1)',
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
        explanation:
          "On avance nœud par nœud en inversant à chaque étape le pointeur next pour qu'il pointe vers le nœud précédent, en sauvegardant d'abord une référence vers le nœud suivant avant de la perdre.",
      },
      {
        label: 'Récursive',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        code: `static Node reverseRecursive(Node head) {
    if (head == null || head.next == null) return head;
    Node newHead = reverseRecursive(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}`,
        explanation:
          "On inverse d'abord récursivement le reste de la liste, puis on fait pointer le nœud suivant vers le nœud courant, avant de couper l'ancien lien vers l'avant.",
      },
    ],
    verdict:
      "Même temps, mais l'itérative évite tout risque de StackOverflowError sur une longue liste.",
  },
  {
    id: 'detect-cycle',
    category: 'linkedlist',
    title: 'Détecter un cycle (tortue et lièvre)',
    problem: 'Une liste chaînée contient-elle un cycle ?',
    lang: 'java',
    approaches: [
      {
        label: 'HashSet des nœuds visités',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        code: `static boolean hasCycleHashSet(Node head) {
    Set<Node> visited = new HashSet<>();
    while (head != null) {
        if (!visited.add(head)) return true;
        head = head.next;
    }
    return false;
}`,
        explanation:
          "On mémorise chaque nœud visité dans un Set ; si on retombe sur un nœud déjà présent, c'est qu'on a bouclé.",
      },
      {
        label: 'Floyd (deux vitesses)',
        time: 'O(n)',
        tier: 2,
        space: 'O(1)',
        code: `static boolean hasCycle(Node head) {
    Node slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
        explanation:
          "Deux pointeurs parcourent la liste à des vitesses différentes (un pas et deux pas) ; s'il existe un cycle, le pointeur rapide finit toujours par rattraper le lent à l'intérieur de la boucle.",
      },
    ],
    verdict:
      'Même complexité en temps que le HashSet, mais espace constant — le classique testé en entretien.',
  },
  {
    id: 'merge-sorted-lists',
    category: 'linkedlist',
    title: 'Fusionner deux listes triées',
    problem: 'Fusionner deux listes chaînées déjà triées en une seule liste triée.',
    lang: 'java',
    approaches: [
      {
        label: 'Fusion avec nœud sentinelle',
        time: 'O(n+m)',
        tier: 2,
        space: 'O(1)',
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
        explanation:
          "Un nœud sentinelle sert de point de départ fictif ; à chaque étape on rattache le plus petit des deux nœuds en tête de chaque liste, puis on avance dans la liste correspondante.",
      },
    ],
    verdict: "Un nœud sentinelle (dummy) évite de traiter le premier nœud comme un cas particulier.",
  },
  {
    id: 'bfs-vs-dfs',
    category: 'trees',
    title: 'BFS vs DFS',
    problem: 'Parcourir un graphe ou un arbre.',
    lang: 'java',
    approaches: [
      {
        label: 'BFS (largeur)',
        time: 'O(V+E)',
        tier: 2,
        space: 'O(V)',
        code: `static void bfs(Map<Integer, List<Integer>> graph, int start) {
    Queue<Integer> queue = new LinkedList<>(List.of(start));
    Set<Integer> visited = new HashSet<>(List.of(start));
    while (!queue.isEmpty()) {
        int node = queue.poll();
        for (int next : graph.getOrDefault(node, List.of()))
            if (visited.add(next)) queue.add(next);
    }
}`,
        explanation:
          "Une file (FIFO) garantit que les nœuds sont traités dans l'ordre où ils ont été découverts, donc niveau par niveau ; un Set évite de retraiter un même nœud plusieurs fois.",
      },
      {
        label: 'DFS (profondeur)',
        time: 'O(V+E)',
        tier: 2,
        space: 'O(h)',
        code: `static void dfs(Map<Integer, List<Integer>> graph, int node, Set<Integer> visited) {
    if (!visited.add(node)) return;
    for (int next : graph.getOrDefault(node, List.of())) {
        dfs(graph, next, visited);
    }
}`,
        explanation:
          "On marque le nœud courant comme visité, puis on explore immédiatement et récursivement chacun de ses voisins non visités avant de revenir en arrière.",
      },
    ],
    verdict:
      'Même temps — le choix dépend du besoin : plus court chemin → BFS, exploration/backtracking → DFS.',
  },
  {
    id: 'tree-height-balance',
    category: 'trees',
    title: "Hauteur & équilibre d'un arbre binaire",
    problem: 'Vérifier si un arbre binaire est équilibré.',
    lang: 'java',
    approaches: [
      {
        label: 'Recalculer la hauteur à chaque nœud',
        time: 'O(n log n)',
        tier: 3,
        space: 'O(h)',
        code: `static boolean isBalancedNaive(TreeNode node) {
    if (node == null) return true;
    int diff = Math.abs(height(node.left) - height(node.right));
    return diff <= 1 && isBalancedNaive(node.left) && isBalancedNaive(node.right);
}
// height() recalcule toute la hauteur du sous-arbre à chaque appel`,
        explanation:
          "Pour chaque nœud, on recalcule entièrement la hauteur de ses deux sous-arbres afin de vérifier l'écart ; ce même travail est refait à chaque niveau de la récursion.",
      },
      {
        label: 'Calcul bottom-up en une passe',
        time: 'O(n)',
        tier: 2,
        space: 'O(h)',
        code: `static int checkHeight(TreeNode node) {
    if (node == null) return 0;
    int left = checkHeight(node.left);
    if (left == -1) return -1;
    int right = checkHeight(node.right);
    if (right == -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return 1 + Math.max(left, right);
}`,
        explanation:
          "Chaque appel calcule la hauteur ET vérifie l'équilibre en une seule passe ; dès qu'un déséquilibre est détecté quelque part, la valeur sentinelle -1 remonte immédiatement jusqu'à l'appelant initial.",
      },
    ],
    verdict:
      "Combiner hauteur et vérification d'équilibre en une récursion évite de retraverser les mêmes sous-arbres.",
  },
  {
    id: 'lca-bst',
    category: 'trees',
    title: 'Plus proche ancêtre commun (BST)',
    problem:
      "Trouver l'ancêtre commun le plus bas de deux nœuds dans un arbre binaire de recherche.",
    lang: 'java',
    approaches: [
      {
        label: 'Arbre binaire quelconque',
        time: 'O(n)',
        tier: 2,
        space: 'O(h)',
        code: `static TreeNode lowestCommonAncestorGeneric(TreeNode root, int p, int q) {
    if (root == null || root.val == p || root.val == q) return root;
    TreeNode left = lowestCommonAncestorGeneric(root.left, p, q);
    TreeNode right = lowestCommonAncestorGeneric(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}`,
        explanation:
          "Sans supposer d'ordre particulier, on cherche p et q dans les deux sous-arbres ; si chacun est trouvé d'un côté différent, le nœud courant est l'ancêtre commun.",
      },
      {
        label: 'Descente directe (BST)',
        time: 'O(h)',
        tier: 1,
        space: 'O(1)',
        code: `static TreeNode lowestCommonAncestor(TreeNode root, int p, int q) {
    TreeNode node = root;
    while (node != null) {
        if (p < node.val && q < node.val) node = node.left;
        else if (p > node.val && q > node.val) node = node.right;
        else return node;
    }
    return null;
}`,
        explanation:
          "Grâce à l'ordre du BST, on sait si les deux valeurs cherchées sont toutes les deux à gauche, toutes les deux à droite, ou de part et d'autre du nœud courant — dans ce dernier cas, ce nœud est l'ancêtre commun.",
      },
    ],
    verdict:
      "La propriété d'ordre d'un BST transforme un parcours en une simple descente — inapplicable sur un arbre non trié.",
  },
  {
    id: 'union-find',
    category: 'trees',
    title: 'Union-Find (cycle dans un graphe)',
    problem: "Détecter un cycle ou des composantes connexes à mesure que des arêtes s'ajoutent.",
    lang: 'java',
    approaches: [
      {
        label: 'DFS/BFS à chaque ajout',
        time: 'O(V+E)',
        tier: 2,
        space: 'O(V)',
        code: `static boolean isConnected(Map<Integer, List<Integer>> graph, int a, int b) {
    Set<Integer> visited = new HashSet<>();
    Deque<Integer> stack = new ArrayDeque<>(List.of(a));
    while (!stack.isEmpty()) {
        int node = stack.pop();
        if (node == b) return true;
        if (visited.add(node)) stack.addAll(graph.getOrDefault(node, List.of()));
    }
    return false;
}`,
        explanation:
          "Pour savoir si deux nœuds sont déjà connectés, on relance un parcours complet du graphe depuis l'un d'eux à chaque nouvelle arête ajoutée.",
      },
      {
        label: 'Union-Find + compression',
        time: 'O(α(n)) amorti',
        tier: 1,
        space: 'O(V)',
        code: `static int find(int[] parent, int x) {
    if (parent[x] != x) parent[x] = find(parent, parent[x]); // compression de chemin
    return parent[x];
}
static void union(int[] parent, int a, int b) {
    parent[find(parent, a)] = find(parent, b);
}`,
        explanation:
          "find() remonte la chaîne des parents jusqu'à la racine du groupe et reconnecte au passage chaque nœud visité directement à cette racine ; union() relie ensuite les racines de deux groupes entre eux.",
      },
    ],
    verdict:
      "La compression de chemin rend chaque recherche quasi instantanée pour un grand nombre d'arêtes.",
  },
  {
    id: 'fibonacci',
    category: 'dp',
    title: 'Fibonacci',
    problem: 'Calculer le n-ième terme de la suite de Fibonacci.',
    lang: 'java',
    approaches: [
      {
        label: 'Récursion naïve',
        time: 'O(2ⁿ)',
        tier: 4,
        space: 'O(n)',
        code: `static long fibonacciNaive(int n) {
    if (n <= 1) return n;
    return fibonacciNaive(n - 1) + fibonacciNaive(n - 2);
}`,
        explanation:
          "Chaque appel se décompose en deux appels récursifs qui recalculent indépendamment les mêmes sous-problèmes, sans jamais réutiliser un résultat déjà obtenu.",
      },
      {
        label: 'Mémoïsation',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        code: `static long fibonacciMemo(int n, Map<Integer, Long> cache) {
    if (n <= 1) return n;
    if (cache.containsKey(n)) return cache.get(n);
    long result = fibonacciMemo(n - 1, cache) + fibonacciMemo(n - 2, cache);
    cache.put(n, result);
    return result;
}`,
        explanation:
          "Avant de recalculer fibonacci(n), on vérifie s'il est déjà dans le cache ; sinon on le calcule une seule fois et on le stocke pour tous les appels suivants.",
      },
      {
        label: 'Itératif',
        time: 'O(n)',
        tier: 2,
        space: 'O(1)',
        code: `static long fibonacci(int n) {
    long a = 0, b = 1;
    for (int i = 0; i < n; i++) { long next = a + b; a = b; b = next; }
    return a;
}`,
        explanation:
          "On garde seulement les deux derniers termes (a et b) et on avance itérativement : à chaque tour, b devient a+b et a prend l'ancienne valeur de b.",
      },
    ],
    verdict:
      "La mémoïsation élimine la recomputation exponentielle ; l'itératif élimine aussi la pile d'appels.",
  },
  {
    id: 'coin-change',
    category: 'dp',
    title: 'Rendu de monnaie (nombre minimal de pièces)',
    problem: 'Rendre un montant avec le moins de pièces possible.',
    lang: 'java',
    approaches: [
      {
        label: 'Glouton (plus grande pièce d’abord)',
        time: 'O(montant)',
        tier: 2,
        space: 'O(1)',
        caution: true,
        code: `static int minCoinsGreedy(int[] coins, int amount) {
    Arrays.sort(coins);
    int count = 0;
    for (int i = coins.length - 1; i >= 0 && amount > 0; i--) {
        count += amount / coins[i];
        amount %= coins[i];
    }
    return amount == 0 ? count : -1;
}`,
        explanation:
          "On utilise autant que possible la plus grande pièce disponible, puis on passe à la pièce inférieure sur le reste — rapide, mais peut donner un résultat sous-optimal ou même incorrect selon le système de pièces.",
      },
      {
        label: 'Programmation dynamique',
        time: 'O(montant · pièces)',
        tier: 3,
        space: 'O(montant)',
        code: `static int minCoins(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, Integer.MAX_VALUE - 1);
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        for (int c : coins) if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);
    return dp[amount];
}`,
        explanation:
          "dp[a] contient le nombre minimal de pièces pour rendre le montant a ; pour chaque montant croissant, on essaie chaque pièce utilisable et on garde le meilleur résultat obtenu via dp[a-pièce] + 1.",
      },
    ],
    verdict:
      "Piège classique : le glouton est plus rapide mais pas toujours correct (ex. pièces 1, 3, 4 pour 6) ; la DP l'est toujours.",
  },
  {
    id: 'knapsack',
    category: 'dp',
    title: 'Sac à dos 0/1',
    problem:
      'Maximiser la valeur transportée sous une contrainte de poids, chaque objet pris au plus une fois.',
    lang: 'java',
    approaches: [
      {
        label: 'Tous les sous-ensembles',
        time: 'O(2ⁿ)',
        tier: 4,
        space: 'O(n)',
        code: `static int knapsackBruteForce(int[] weights, int[] values, int capacity, int i) {
    if (i == weights.length || capacity == 0) return 0;
    if (weights[i] > capacity) return knapsackBruteForce(weights, values, capacity, i + 1);
    int skip = knapsackBruteForce(weights, values, capacity, i + 1);
    int take = values[i] + knapsackBruteForce(weights, values, capacity - weights[i], i + 1);
    return Math.max(skip, take);
}`,
        explanation:
          "Pour chaque objet, on explore les deux choix possibles (le prendre ou le laisser) et on garde le meilleur résultat, ce qui génère un arbre de 2ⁿ combinaisons possibles.",
      },
      {
        label: 'DP (tableau 1D)',
        time: 'O(n · capacité)',
        tier: 3,
        space: 'O(capacité)',
        code: `static int knapsack(int[] weights, int[] values, int capacity) {
    int[] dp = new int[capacity + 1];
    for (int i = 0; i < weights.length; i++)
        for (int w = capacity; w >= weights[i]; w--)
            dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
    return dp[capacity];
}`,
        explanation:
          "dp[w] contient la valeur maximale atteignable avec une capacité w ; parcourir les poids à l'envers pour chaque objet garantit qu'un même objet n'est jamais compté deux fois dans la même itération.",
      },
    ],
    verdict:
      "Parcourir la capacité à l'envers évite de réutiliser un même objet deux fois — piège classique.",
  },
  {
    id: 'lru-cache',
    category: 'advanced',
    title: 'LRU Cache',
    problem: 'Implémenter un cache à éviction LRU (Least Recently Used) en O(1).',
    lang: 'java',
    approaches: [
      {
        label: 'Liste + recherche linéaire',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        code: `class NaiveLRUCache {
    private final int capacity;
    private final LinkedList<int[]> entries = new LinkedList<>(); // [clé, valeur]

    NaiveLRUCache(int capacity) { this.capacity = capacity; }

    int get(int key) {
        for (int[] entry : entries) {
            if (entry[0] == key) {
                entries.remove(entry);
                entries.addFirst(entry);
                return entry[1];
            }
        }
        return -1;
    }
}`,
        explanation:
          "Chaque lecture parcourt linéairement la liste pour retrouver la clé, puis la replace en tête ; sans structure d'indexation, chaque opération coûte O(n) dans le pire cas.",
      },
      {
        label: 'HashMap + liste doublement chaînée',
        time: 'O(1)',
        tier: 1,
        space: 'O(n)',
        code: `class LRUCache extends LinkedHashMap<Integer, Integer> {
    private final int capacity;
    LRUCache(int capacity) { super(16, 0.75f, true); this.capacity = capacity; }
    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
        return size() > capacity;
    }
}`,
        explanation:
          "Le troisième paramètre true du constructeur active l'accessOrder, qui replace automatiquement une entrée en fin d'ordre à chaque lecture ou écriture ; removeEldestEntry() est appelée après chaque insertion pour évincer l'entrée la plus ancienne si la capacité est dépassée.",
      },
    ],
    verdict:
      "LinkedHashMap en mode accessOrder réordonne seul les entrées — pas besoin de coder la liste chaînée à la main.",
  },
  {
    id: 'producer-consumer',
    category: 'advanced',
    title: 'Producteur-Consommateur',
    problem: 'Faire communiquer des threads producteurs et consommateurs sans se marcher dessus.',
    lang: 'java',
    approaches: [
      {
        label: 'wait()/notify() manuels',
        time: 'O(1)',
        tier: 2,
        space: 'O(1)',
        caution: true,
        code: `synchronized void produce(Task task) {
    while (queue.size() == capacity) {
        try { wait(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
    queue.add(task);
    notifyAll();
}

synchronized Task consume() {
    while (queue.isEmpty()) {
        try { wait(); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
    }
    Task task = queue.poll();
    notifyAll();
    return task;
}`,
        explanation:
          "On attend manuellement (wait) tant que la condition n'est pas remplie, et on réveille les threads en attente (notifyAll) après chaque changement d'état — toute la synchronisation doit être codée et vérifiée à la main.",
      },
      {
        label: 'BlockingQueue',
        time: 'O(1)',
        tier: 1,
        space: 'O(1)',
        code: `BlockingQueue<Task> queue = new LinkedBlockingQueue<>(100);
// Producteur
queue.put(task);   // bloque si la file est pleine
// Consommateur
Task task = queue.take(); // bloque si la file est vide`,
        explanation:
          "put() met le thread producteur en attente si la file est pleine, take() met le thread consommateur en attente si elle est vide — toute la synchronisation nécessaire est gérée en interne par la classe.",
      },
    ],
    verdict:
      'Même complexité, mais wait/notify expose à des bugs subtils (réveils intempestifs, interblocages) que BlockingQueue évite nativement.',
  },
  {
    id: 'debounce',
    category: 'perf',
    title: 'Debounce',
    problem:
      "Retarder l'exécution d'une fonction jusqu'à ce que l'utilisateur arrête d'agir (ex. champ de recherche).",
    lang: 'javascript',
    approaches: [
      {
        label: 'Sans debounce',
        time: 'O(n) appels',
        tier: 4,
        space: '—',
        code: `input.addEventListener('input', () => {
  fetchResults(input.value); // appelé à chaque frappe, sans délai
});`,
        explanation:
          "Chaque frappe déclenche immédiatement un appel, sans attendre que l'utilisateur ait fini de taper.",
      },
      {
        label: 'Avec debounce',
        time: 'O(1) appel',
        tier: 1,
        space: 'O(1)',
        code: `function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}`,
        explanation:
          "Chaque nouvel appel annule le minuteur précédent (clearTimeout) et en programme un nouveau ; seul le dernier appel dont le minuteur va jusqu'au bout finit par déclencher réellement fn.",
      },
    ],
    verdict:
      "Annule le minuteur précédent à chaque appel — seule la dernière frappe après la pause déclenche fn.",
  },
  {
    id: 'throttle',
    category: 'perf',
    title: 'Throttle',
    problem: "Limiter la fréquence d'exécution d'une fonction (ex. gestion du scroll).",
    lang: 'javascript',
    approaches: [
      {
        label: 'Sans throttle',
        time: 'O(n) appels',
        tier: 4,
        space: '—',
        code: `window.addEventListener('scroll', () => {
  handleScroll(); // appelé à chaque événement de scroll, potentiellement des centaines de fois par seconde
});`,
        explanation:
          "Chaque événement de scroll déclenche immédiatement le traitement, sans aucune limite de fréquence.",
      },
      {
        label: 'Avec throttle',
        time: 'O(n/k) appels',
        tier: 2,
        space: 'O(1)',
        code: `function throttle(fn, limit) {
  let inCooldown = false;
  return (...args) => {
    if (inCooldown) return;
    fn(...args);
    inCooldown = true;
    setTimeout(() => (inCooldown = false), limit);
  };
}`,
        explanation:
          "Le premier appel s'exécute immédiatement puis verrouille les appels suivants (inCooldown) pendant limit millisecondes ; une fois ce délai écoulé, un nouvel appel pourra à nouveau passer.",
      },
    ],
    verdict:
      "Contrairement au debounce, le throttle garantit une exécution régulière même si l'activité ne s'arrête jamais.",
  },
  {
    id: 'deep-clone',
    category: 'perf',
    title: "Deep clone d'un objet",
    problem: "Dupliquer un objet en profondeur, sans référence partagée avec l'original.",
    lang: 'javascript',
    approaches: [
      {
        label: 'JSON.parse(JSON.stringify())',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        caution: true,
        code: `const clone = JSON.parse(JSON.stringify(original));
// perd les fonctions, Date (devient une string), et échoue sur les références circulaires`,
        explanation:
          "On sérialise l'objet en texte JSON puis on le reparse immédiatement ; cela recrée une structure de données indépendante, mais uniquement pour les types que JSON sait représenter.",
      },
      {
        label: 'structuredClone()',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        code: `const clone = structuredClone(original);
// natif depuis Node 17 / navigateurs modernes`,
        explanation:
          "structuredClone parcourt récursivement la structure de l'objet et en reconstruit une copie complète, en gérant nativement les types complexes (Date, Map, Set) et les références circulaires.",
      },
    ],
    verdict:
      'Même complexité, mais structuredClone gère Date, Map, Set et les cycles que JSON casse silencieusement.',
  },
  {
    id: 'memoization',
    category: 'perf',
    title: 'Mémoïsation',
    problem: "Éviter de recalculer le résultat d'une fonction pure pour des arguments déjà vus.",
    lang: 'javascript',
    approaches: [
      {
        label: 'Sans cache',
        time: 'O(n) recalculs',
        tier: 2,
        space: 'O(1)',
        code: `function slowSquare(n) {
  // recalcule le résultat à chaque appel, même pour un argument déjà traité
  return n * n;
}`,
        explanation:
          "La fonction est rappelée intégralement à chaque fois, même si elle a déjà été exécutée avec exactement les mêmes arguments.",
      },
      {
        label: 'Avec cache (Map)',
        time: 'O(1) amorti',
        tier: 1,
        space: 'O(n)',
        code: `function memoize(fn) {
  const cache = new Map();
  return (arg) => {
    if (cache.has(arg)) return cache.get(arg);
    const result = fn(arg);
    cache.set(arg, result);
    return result;
  };
}`,
        explanation:
          "Avant de calculer, on vérifie si le résultat pour cet argument est déjà dans le cache ; si oui on le renvoie directement, sinon on calcule, on stocke le résultat, puis on le renvoie.",
      },
    ],
    verdict:
      'Exactement le principe derrière useMemo/useCallback en React — éviter un calcul ou une fonction déjà identique.',
  },
  {
    id: 'list-virtualization',
    category: 'perf',
    title: 'Virtualisation de liste',
    problem: 'Afficher une liste de 10 000 éléments sans tout monter dans le DOM.',
    lang: 'javascript',
    approaches: [
      {
        label: 'Rendu complet',
        time: 'O(n) nœuds DOM',
        tier: 4,
        space: 'O(n)',
        code: `function renderAll(items) {
  return items.map((item) => renderRow(item)); // un nœud DOM par élément, quel que soit n
}`,
        explanation:
          "On crée un élément du DOM pour chacun des n éléments de la liste, y compris ceux qui ne sont pas visibles à l'écran.",
      },
      {
        label: 'Fenêtrage (windowing)',
        time: 'O(visible)',
        tier: 1,
        space: 'O(visible)',
        code: `const startIndex = Math.floor(scrollTop / itemHeight);
const endIndex = startIndex + Math.ceil(viewportHeight / itemHeight);
const visibleItems = allItems.slice(startIndex, endIndex);`,
        explanation:
          "On calcule à partir de la position de défilement (scrollTop) quels indices d'éléments sont actuellement visibles à l'écran, et on ne garde (slice) que cette tranche du tableau complet à rendre.",
      },
    ],
    verdict:
      "Le coût de rendu devient indépendant de la taille totale — seul le nombre d'éléments visibles compte.",
  },
  {
    id: 'flatten-array',
    category: 'perf',
    title: 'Aplatir un tableau imbriqué',
    problem: 'Transformer un tableau imbriqué à profondeur variable en tableau plat.',
    lang: 'javascript',
    approaches: [
      {
        label: 'Boucles à profondeur fixe',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        caution: true,
        code: `function flattenFixedDepth(arr) {
  const result = [];
  for (const outer of arr) {
    if (Array.isArray(outer)) {
      for (const inner of outer) {
        result.push(inner); // ne gère qu'un seul niveau d'imbrication supplémentaire
      }
    } else {
      result.push(outer);
    }
  }
  return result;
}`,
        explanation:
          "Deux boucles imbriquées codées en dur ne gèrent qu'un seul niveau supplémentaire de profondeur ; un tableau imbriqué plus profondément resterait partiellement aplati.",
      },
      {
        label: 'Récursion générique',
        time: 'O(n)',
        tier: 2,
        space: 'O(n)',
        code: `function flatten(arr) {
  return arr.reduce(
    (flat, item) => flat.concat(Array.isArray(item) ? flatten(item) : item),
    []
  );
}
// Équivalent natif : arr.flat(Infinity)`,
        explanation:
          "reduce() parcourt chaque élément : si c'est un tableau, on l'aplatit récursivement avant de le concaténer au résultat ; sinon, on le concatène directement.",
      },
    ],
    verdict:
      "La récursion s'adapte à n'importe quelle profondeur, contrairement à des boucles imbriquées codées en dur.",
  },
]
